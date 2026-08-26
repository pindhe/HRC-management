"use client";

import { FormEvent, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { PdfPick } from "@/components/admin/PdfPick";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fromDatetimeLocal, isValidDateWindow } from "@/lib/book-dates";
import { useI18n } from "@/lib/i18n/language-provider";

export function AdminBookCreate() {
  const { t } = useI18n();
  const router = useRouter();
  const formId = useId();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fileSo, setFileSo] = useState<File | null>(null);
  const [fileEn, setFileEn] = useState<File | null>(null);
  const [fileAr, setFileAr] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [missing, setMissing] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) {
      setError(t.admin.bookTitleError);
      setMissing(false);
      return;
    }
    const startIso = fromDatetimeLocal(startDate);
    const endIso = fromDatetimeLocal(endDate);
    if (!startIso || !endIso) {
      setError(t.admin.dateError);
      setMissing(false);
      return;
    }
    if (!isValidDateWindow(startIso, endIso)) {
      setError(t.admin.datesOrderError);
      setMissing(false);
      return;
    }
    if (!fileSo || !fileEn || !fileAr) {
      setError(t.admin.pdfsError);
      setMissing(true);
      return;
    }

    setError("");
    setMissing(false);
    setUploading(true);
    const body = new FormData();
    body.set("title", title.trim());
    body.set("author", author.trim());
    body.set("startDate", startIso);
    body.set("endDate", endIso);
    body.set("fileSO", fileSo);
    body.set("fileEN", fileEn);
    body.set("fileAR", fileAr);
    const response = await fetch("/api/books", { method: "POST", body });
    setUploading(false);
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error === "dates" ? t.admin.datesOrderError : t.admin.pdfsError);
      return;
    }
    router.push("/admin/books");
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="font-heading text-3xl text-forest sm:text-4xl">
        {t.admin.uploadBook}
      </h1>
      <p className="mt-2 text-muted">{t.admin.booksHint}</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-6" noValidate>
        <section className="rounded-3xl border border-forest/10 bg-ivory p-5 shadow-sm sm:p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`${formId}-title`}>{t.admin.bookTitle}</Label>
              <Input
                id={`${formId}-title`}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${formId}-author`}>{t.admin.bookAuthor}</Label>
              <Input
                id={`${formId}-author`}
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                className="h-12"
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-forest/10 bg-ivory p-5 shadow-sm sm:p-7">
          <h2 className="font-heading text-xl text-forest">{t.admin.datesSection}</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
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
        </section>

        <section className="rounded-3xl border border-forest/10 bg-ivory p-5 shadow-sm sm:p-7">
          <h2 className="font-heading text-xl text-forest">{t.admin.pdfsSection}</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <PdfPick
              id={`${formId}-so`}
              label={t.admin.pdfSo}
              file={fileSo}
              onFile={setFileSo}
              invalid={missing}
            />
            <PdfPick
              id={`${formId}-en`}
              label={t.admin.pdfEn}
              file={fileEn}
              onFile={setFileEn}
              invalid={missing}
            />
            <PdfPick
              id={`${formId}-ar`}
              label={t.admin.pdfAr}
              file={fileAr}
              onFile={setFileAr}
              invalid={missing}
            />
          </div>
        </section>

        {error ? <p className="text-sm text-red-700">{error}</p> : null}

        <Button type="submit" size="lg" disabled={uploading}>
          <Upload aria-hidden />
          {uploading ? t.admin.uploading : t.admin.uploadBook}
        </Button>
      </form>
    </div>
  );
}
