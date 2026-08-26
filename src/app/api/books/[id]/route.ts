import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api-auth";
import {
  deleteLibraryBook,
  getLibraryBook,
  isBookLang,
  parsePdfUpload,
  readPdfFile,
  updateLibraryBook,
  type PdfUpload,
} from "@/lib/library";
import { fromDatetimeLocal, isBookEnded, isValidDateWindow } from "@/lib/book-dates";
import { BOOK_LANGS, type BookLang } from "@/lib/library-types";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  const role = await requireRole(["admin", "member", "cashier"]);
  if (!role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const langParam = new URL(request.url).searchParams.get("lang");
  const lang: BookLang = isBookLang(langParam) ? langParam : "so";
  const book = await getLibraryBook(id);
  const data = await readPdfFile(id, lang);
  if (!book || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if ((role === "member" || role === "cashier") && isBookEnded(book.endDate)) {
    return NextResponse.json({ error: "ended" }, { status: 403 });
  }

  const bytes = new Uint8Array(data);
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${encodeURIComponent(book.files[lang].fileName || `${book.title}.pdf`)}"`,
      "Cache-Control": "private, max-age=0",
    },
  });
}

export async function PUT(request: Request, context: RouteContext) {
  const role = await requireRole(["admin"]);
  if (!role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const form = await request.formData();
    const title = String(form.get("title") ?? "").trim();
    const author = String(form.get("author") ?? "").trim();
    const startDate = fromDatetimeLocal(String(form.get("startDate") ?? ""));
    const endDate = fromDatetimeLocal(String(form.get("endDate") ?? ""));
    if (!title) {
      return NextResponse.json({ error: "title" }, { status: 400 });
    }
    if (!isValidDateWindow(startDate, endDate)) {
      return NextResponse.json({ error: "dates" }, { status: 400 });
    }

    const files: Partial<Record<BookLang, PdfUpload>> = {};
    for (const lang of BOOK_LANGS) {
      const upload = await parsePdfUpload(form, `file${lang.toUpperCase()}`);
      if (upload) files[lang] = upload;
    }

    const book = await updateLibraryBook(id, {
      title,
      author,
      startDate,
      endDate,
      files: Object.keys(files).length ? files : undefined,
    });
    if (!book) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ book });
  } catch (error) {
    const code = error instanceof Error ? error.message : "pdf";
    const status = code === "size" ? 413 : 400;
    return NextResponse.json({ error: code }, { status });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const role = await requireRole(["admin"]);
  if (!role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const ok = await deleteLibraryBook(id);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
