export const BOOK_LANGS = ["so", "en", "ar"] as const;

export type BookLang = (typeof BOOK_LANGS)[number];

export type LibraryBookFile = {
  fileName: string;
};

export type LibraryBook = {
  id: string;
  title: string;
  author: string;
  startDate: string;
  endDate: string;
  files: Record<BookLang, LibraryBookFile>;
  createdAt: string;
};
