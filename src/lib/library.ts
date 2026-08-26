import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  BOOK_LANGS,
  type BookLang,
  type LibraryBook,
} from "@/lib/library-types";

export type { BookLang, LibraryBook } from "@/lib/library-types";
export { BOOK_LANGS } from "@/lib/library-types";

const ROOT = path.join(process.cwd(), "data", "library");
const CATALOG = path.join(ROOT, "catalog.json");
const FILES = path.join(ROOT, "files");

export const MAX_PDF_BYTES = 25 * 1024 * 1024;

function isBookId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id,
  );
}

export function isBookLang(value: string | null): value is BookLang {
  return value === "so" || value === "en" || value === "ar";
}

function langPath(id: string, lang: BookLang) {
  return path.join(FILES, `${id}-${lang}.pdf`);
}

function legacyPath(id: string) {
  return path.join(FILES, `${id}.pdf`);
}

async function ensureDirs() {
  await mkdir(FILES, { recursive: true });
}

function normalizeBook(raw: unknown): LibraryBook | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Partial<LibraryBook> & { fileName?: string };
  if (!item.id || !item.title) return null;
  const fallback = item.fileName ? { fileName: item.fileName } : { fileName: "" };
  return {
    id: item.id,
    title: item.title,
    author: item.author ?? "",
    startDate: item.startDate ?? "",
    endDate: item.endDate ?? "",
    createdAt: item.createdAt ?? new Date().toISOString(),
    files: {
      so: item.files?.so ?? fallback,
      en: item.files?.en ?? fallback,
      ar: item.files?.ar ?? fallback,
    },
  };
}

export async function readCatalog(): Promise<LibraryBook[]> {
  try {
    const raw = await readFile(CATALOG, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(normalizeBook)
      .filter((book): book is LibraryBook => Boolean(book));
  } catch {
    return [];
  }
}

async function writeCatalog(books: LibraryBook[]) {
  await ensureDirs();
  await writeFile(CATALOG, JSON.stringify(books, null, 2), "utf8");
}

export function isPdfBuffer(buffer: Buffer) {
  return buffer.subarray(0, 5).toString("ascii") === "%PDF-";
}

export async function parsePdfUpload(
  form: FormData,
  key: string,
): Promise<PdfUpload | null> {
  const file = form.get(key);
  if (!(file instanceof File) || file.size === 0) return null;
  if (file.size > MAX_PDF_BYTES) {
    throw new Error("size");
  }
  const data = Buffer.from(await file.arrayBuffer());
  if (!isPdfBuffer(data)) throw new Error("pdf");
  return { fileName: file.name, data };
}

export type PdfUpload = {
  fileName: string;
  data: Buffer;
};

export async function addLibraryBook(input: {
  title: string;
  author: string;
  startDate: string;
  endDate: string;
  files: Record<BookLang, PdfUpload>;
}): Promise<LibraryBook> {
  await ensureDirs();
  const id = crypto.randomUUID();
  const book: LibraryBook = {
    id,
    title: input.title,
    author: input.author,
    startDate: input.startDate,
    endDate: input.endDate,
    createdAt: new Date().toISOString(),
    files: {
      so: { fileName: input.files.so.fileName },
      en: { fileName: input.files.en.fileName },
      ar: { fileName: input.files.ar.fileName },
    },
  };
  await Promise.all(
    BOOK_LANGS.map((lang) =>
      writeFile(langPath(id, lang), input.files[lang].data),
    ),
  );
  await writeCatalog([book, ...(await readCatalog())]);
  return book;
}

export async function getLibraryBook(id: string) {
  if (!isBookId(id)) return null;
  return (await readCatalog()).find((book) => book.id === id) ?? null;
}

export async function updateLibraryBook(
  id: string,
  patch: {
    title: string;
    author: string;
    startDate: string;
    endDate: string;
    files?: Partial<Record<BookLang, PdfUpload>>;
  },
): Promise<LibraryBook | null> {
  const books = await readCatalog();
  const index = books.findIndex((book) => book.id === id);
  if (index < 0) return null;

  const current = books[index];
  const files = { ...current.files };
  if (patch.files) {
    await ensureDirs();
    for (const lang of BOOK_LANGS) {
      const upload = patch.files[lang];
      if (!upload) continue;
      files[lang] = { fileName: upload.fileName };
      await writeFile(langPath(id, lang), upload.data);
    }
  }

  const updated: LibraryBook = {
    ...current,
    title: patch.title,
    author: patch.author,
    startDate: patch.startDate,
    endDate: patch.endDate,
    files,
  };
  const next = [...books];
  next[index] = updated;
  await writeCatalog(next);
  return updated;
}

export async function deleteLibraryBook(id: string) {
  if (!isBookId(id)) return false;
  const books = await readCatalog();
  const next = books.filter((book) => book.id !== id);
  if (next.length === books.length) return false;
  await writeCatalog(next);
  const victims = [
    ...BOOK_LANGS.map((lang) => langPath(id, lang)),
    legacyPath(id),
  ];
  await Promise.all(
    victims.map(async (file) => {
      try {
        await unlink(file);
      } catch {
        // Ignore missing files.
      }
    }),
  );
  return true;
}

export async function readPdfFile(id: string, lang: BookLang) {
  if (!isBookId(id)) return null;
  try {
    return await readFile(langPath(id, lang));
  } catch {
    try {
      return await readFile(legacyPath(id));
    } catch {
      return null;
    }
  }
}
