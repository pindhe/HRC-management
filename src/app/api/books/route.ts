import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api-auth";
import {
  addLibraryBook,
  parsePdfUpload,
  readCatalog,
  type PdfUpload,
} from "@/lib/library";
import { fromDatetimeLocal, isValidDateWindow } from "@/lib/book-dates";
import { BOOK_LANGS, type BookLang } from "@/lib/library-types";

export const runtime = "nodejs";

export async function GET() {
  const role = await requireRole(["admin", "member", "cashier"]);
  if (!role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ books: await readCatalog() });
}

export async function POST(request: Request) {
  const role = await requireRole(["admin"]);
  if (!role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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

    const files = {} as Record<BookLang, PdfUpload>;
    for (const lang of BOOK_LANGS) {
      const upload = await parsePdfUpload(form, `file${lang.toUpperCase()}`);
      if (!upload) {
        return NextResponse.json({ error: "pdfs" }, { status: 400 });
      }
      files[lang] = upload;
    }

    const book = await addLibraryBook({ title, author, startDate, endDate, files });
    return NextResponse.json({ book }, { status: 201 });
  } catch (error) {
    const code = error instanceof Error ? error.message : "pdf";
    const status = code === "size" ? 413 : 400;
    return NextResponse.json({ error: code }, { status });
  }
}
