"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, BookOpen } from "lucide-react";
import { BookSchedule } from "@/components/books/BookSchedule";
import { MemberPdfViewer } from "@/components/member/MemberPdfViewer";
import { isBookEnded } from "@/lib/book-dates";
import { useI18n } from "@/lib/i18n/language-provider";
import { BOOK_LANGS, type BookLang, type LibraryBook } from "@/lib/library-types";
import { cn } from "@/lib/utils";

export function ClubBooks({ heading }: { heading?: string }) {
  const { t } = useI18n();
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [lang, setLang] = useState<BookLang | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/books")
      .then((response) => (response.ok ? response.json() : { books: [] }))
      .then((data: { books: LibraryBook[] }) => {
        if (!cancelled) setBooks(data.books ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const current = books.find((book) => book.id === openId) ?? null;
  const currentEnded = current ? isBookEnded(current.endDate) : false;
  const labels: Record<BookLang, string> = {
    so: t.member.langSo,
    en: t.member.langEn,
    ar: t.member.langAr,
  };

  function closeBook() {
    setOpenId(null);
    setLang(null);
  }

  useEffect(() => {
    if (currentEnded) setLang(null);
  }, [currentEnded]);

  const closeReader = useCallback(() => {
    setLang(null);
  }, []);

  const reader =
    current && lang && !currentEnded ? (
      <MemberPdfViewer
        title={current.title}
        langLabel={labels[lang]}
        src={`/api/books/${current.id}?lang=${lang}#toolbar=1&navpanes=0&view=FitH`}
        onBack={closeReader}
        backLabel={t.member.chooseLanguage}
      />
    ) : null;

  if (current) {
    return (
      <>
        <div>
          <button
            type="button"
            onClick={closeBook}
            className="inline-flex items-center gap-2 text-sm font-medium text-forest hover:text-gold"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {t.member.backToBooks}
          </button>
          <h1 className="font-heading mt-5 text-3xl text-forest">{current.title}</h1>
          {current.author ? <p className="mt-2 text-muted">{current.author}</p> : null}
          <BookSchedule
            className="mt-2"
            startDate={current.startDate}
            endDate={current.endDate}
          />
          {currentEnded ? (
            <p className="mt-6 text-sm font-medium text-red-600">{t.member.bookClosed}</p>
          ) : (
            <>
              <p className="mt-6 text-sm font-medium text-forest-deep">
                {t.member.chooseLanguage}
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {BOOK_LANGS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setLang(value)}
                    className={cn(
                      "flex h-14 items-center justify-center rounded-2xl border border-forest/10 bg-ivory text-sm font-semibold text-forest shadow-sm hover:border-gold/50",
                    )}
                  >
                    {labels[value]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        {reader}
      </>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-3xl text-forest sm:text-4xl">
        {heading ?? t.member.readBook}
      </h1>
      <div className="mt-8 space-y-3">
        {!loaded ? null : books.length === 0 ? (
          <p className="text-sm text-muted">{t.member.booksEmpty}</p>
        ) : (
          books.map((book) => {
            const ended = isBookEnded(book.endDate);
            const content = (
              <>
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gold/15 text-forest">
                  <BookOpen className="size-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-forest-deep">{book.title}</span>
                  {book.author ? (
                    <span className="block truncate text-sm text-muted">{book.author}</span>
                  ) : null}
                  <span className="mt-1.5 block">
                    <BookSchedule startDate={book.startDate} endDate={book.endDate} />
                  </span>
                </span>
                <span
                  className={cn(
                    "mt-2.5 text-sm font-medium",
                    ended ? "text-red-600" : "text-gold",
                  )}
                >
                  {ended ? t.member.timeEnded : t.member.openBook}
                </span>
              </>
            );

            if (ended) {
              return (
                <div
                  key={book.id}
                  className="flex w-full items-start gap-4 rounded-2xl border border-forest/10 bg-ivory p-4 text-start shadow-sm"
                >
                  {content}
                </div>
              );
            }

            return (
              <button
                key={book.id}
                type="button"
                onClick={() => setOpenId(book.id)}
                className="flex w-full items-start gap-4 rounded-2xl border border-forest/10 bg-ivory p-4 text-start shadow-sm hover:border-gold/50"
              >
                {content}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
