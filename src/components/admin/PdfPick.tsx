"use client";

import { FileText } from "lucide-react";
import { useI18n } from "@/lib/i18n/language-provider";
import { cn } from "@/lib/utils";

function fileLabel(file: File) {
  const mb = file.size / (1024 * 1024);
  const size = mb >= 0.1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`;
  return `${file.name} · ${size}`;
}

export function PdfPick({
  id,
  label,
  file,
  onFile,
  invalid = false,
  currentName,
}: {
  id: string;
  label: string;
  file: File | null;
  onFile: (file: File | null) => void;
  invalid?: boolean;
  currentName?: string;
}) {
  const { t } = useI18n();
  const chosen = Boolean(file);
  const status = file
    ? fileLabel(file)
    : currentName
      ? currentName
      : t.admin.noPdfChosen;

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-forest-deep">{label}</p>
      <label
        htmlFor={id}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          event.preventDefault();
          const next = event.dataTransfer.files[0];
          if (next) onFile(next);
        }}
        className={cn(
          "flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-5 text-center transition-colors",
          chosen
            ? "border-gold bg-gold/10"
            : "border-forest/20 bg-page hover:border-gold/50",
          invalid && !chosen ? "border-red-500 bg-red-50/50" : "",
        )}
      >
        <input
          id={id}
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          onChange={(event) => onFile(event.target.files?.[0] ?? null)}
        />
        <span
          className={cn(
            "inline-flex size-11 items-center justify-center rounded-xl",
            chosen ? "bg-gold text-forest-deep" : "bg-beige text-forest",
          )}
        >
          <FileText className="size-5" aria-hidden />
        </span>
        <span className="text-sm font-semibold text-forest">
          {chosen ? t.admin.changePdf : t.admin.choosePdf}
        </span>
        <span className="max-w-full truncate text-xs text-muted">{status}</span>
      </label>
    </div>
  );
}
