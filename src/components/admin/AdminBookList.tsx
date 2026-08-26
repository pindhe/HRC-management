"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import Link from "next/link";
import { BookOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { PdfPick } from "@/components/admin/PdfPick";
import { BookSchedule } from "@/components/books/BookSchedule";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  fromDatetimeLocal,
  isValidDateWindow,
  toDatetimeLocal,
} from "@/lib/book-dates";
import { useI18n } from "@/lib/i18n/language-provider";
import type { LibraryBook } from "@/lib/library-types";

export function AdminBookList() {
  const { t } = useI18n();
  const formId = useId();
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [editing, setEditing] = useState<LibraryBook | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fileSo, setFileSo] = useState<File | null>(null);
  const [fileEn, setFileEn] = useState<File | null>(null);
  const [fileAr, setFileAr] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const response = await fetch("/api/books");
    if (!response.ok) return;
    const data = (await response.json()) as { books: LibraryBook[] };
    setBooks(data.books);
  }

  useEffect(() => {
    void load();
  }, []);

  function openEdit(book: LibraryBook) {
    setEditing(book);
    setTitle(book.title);
    setAuthor(book.author);
    setStartDate(toDatetimeLocal(book.startDate));
    setEndDate(toDatetimeLocal(book.endDate));
    setFileSo(null);
    setFileEn(null);
    setFileAr(null);
    setError("");
  }

  async function onDelete(id: string) {
    if (!window.confirm(t.admin.confirmDeleteBook)) return;
    const response = await fetch(`/api/books/${id}`, { method: "DELETE" });
    if (response.ok) await load();
  }

  async function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    if (!title.trim()) {
      setError(t.admin.bookTitleError);
      return;
    }
    const startIso = fromDatetimeLocal(startDate);
    const endIso = fromDatetimeLocal(endDate);
    if (!startIso || !endIso) {
      setError(t.admin.dateError);
      return;
    }
    if (!isValidDateWindow(startIso, endIso)) {
      setError(t.admin.datesOrderError);
      return;
    }
    setError("");
    setSaving(true);
    const body = new FormData();
    body.set("title", title.trim());
    body.set("author", author.trim());
    body.set("startDate", startIso);
    body.set("endDate", endIso);
    if (fileSo) body.set("fileSO", fileSo);
    if (fileEn) body.set("fileEN", fileEn);
    if (fileAr) body.set("fileAR", fileAr);
    const response = await fetch(`/api/books/${editing.id}`, {
      method: "PUT",
      body,
    });
    setSaving(false);
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(
        data.error === "dates" ? t.admin.datesOrderError : t.admin.pdfError,
      );
      return;
    }
    setEditing(null);
    await load();
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl text-forest sm:text-4xl">
            {t.admin.books}
          </h1>
          <p className="mt-2 text-muted">{t.admin.booksHint}</p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/books/add">
            <Plus aria-hidden />
            {t.admin.memberAdd}
          </Link>
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-forest/10 bg-ivory shadow-sm">
        {books.length === 0 ? (
          <p className="p-6 text-sm text-muted">{t.admin.booksEmpty}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[48rem] text-start text-sm">
              <thead className="border-b border-forest/10 bg-beige/40 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
                <tr>
                  <th className="px-5 py-3 font-semibold">{t.admin.bookTitle}</th>
                  <th className="px-5 py-3 font-semibold">{t.admin.bookAuthor}</th>
                  <th className="px-5 py-3 font-semibold">{t.admin.datesSection}</th>
                  <th className="px-5 py-3 text-end font-semibold">{t.admin.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest/10">
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-beige/25">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex size-9 items-center justify-center rounded-lg bg-gold/15 text-forest">
                          <BookOpen className="size-4" aria-hidden />
                        </span>
                        <span className="font-medium text-forest-deep">{book.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted">{book.author || "—"}</td>
                    <td className="px-5 py-3.5">
                      <BookSchedule startDate={book.startDate} endDate={book.endDate} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(book)}
                          className="inline-flex size-9 items-center justify-center rounded-lg text-forest hover:bg-beige"
                          aria-label={`${t.admin.editMember}: ${book.title}`}
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void onDelete(book.id)}
                          className="inline-flex size-9 items-center justify-center rounded-lg text-red-700 hover:bg-red-50"
                          aria-label={`${t.admin.deleteBook}: ${book.title}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
          <button
            type="button"
            className="absolute inset-0 bg-forest-deep/55"
            aria-label={t.admin.close}
            onClick={() => setEditing(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 max-h-[92svh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-forest/10 bg-ivory p-6 shadow-2xl sm:rounded-3xl"
          >
            <h2 className="font-heading text-xl text-forest">{t.admin.editMember}</h2>
            <form id={`${formId}-edit`} onSubmit={onSave} className="mt-5 space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor={`${formId}-title`}>{t.admin.bookTitle}</Label>
                <Input
                  id={`${formId}-title`}
                  name="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${formId}-author`}>{t.admin.bookAuthor}</Label>
                <Input
                  id={`${formId}-author`}
                  name="author"
                  value={author}
                  onChange={(event) => setAuthor(event.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`${formId}-start`}>{t.admin.dateStart}</Label>
                  <Input
                    id={`${formId}-start`}
                    type="datetime-local"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${formId}-end`}>{t.admin.dateEnd}</Label>
                  <Input
                    id={`${formId}-end`}
                    type="datetime-local"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                    required
                  />
                </div>
              </div>
              <PdfPick
                id={`${formId}-so`}
                label={t.admin.pdfSo}
                file={fileSo}
                onFile={setFileSo}
                currentName={editing.files.so.fileName}
              />
              <PdfPick
                id={`${formId}-en`}
                label={t.admin.pdfEn}
                file={fileEn}
                onFile={setFileEn}
                currentName={editing.files.en.fileName}
              />
              <PdfPick
                id={`${formId}-ar`}
                label={t.admin.pdfAr}
                file={fileAr}
                onFile={setFileAr}
                currentName={editing.files.ar.fileName}
              />
              <p className="text-xs text-muted">{t.admin.replacePdf}</p>
              {error ? <p className="text-xs text-red-700">{error}</p> : null}
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
                  {t.admin.cancel}
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? t.admin.uploading : t.admin.saveChanges}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
