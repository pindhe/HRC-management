"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft } from "lucide-react";

export function MemberPdfViewer({
  title,
  langLabel,
  src,
  onBack,
  backLabel,
}: {
  title: string;
  langLabel: string;
  src: string;
  onBack: () => void;
  backLabel: string;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onBack();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onBack]);

  if (!ready) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col bg-black">
      <div className="bg-forest-deep pt-[env(safe-area-inset-top)] text-ivory">
        <div className="flex h-12 items-center gap-3 px-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-ivory hover:bg-ivory/10"
            aria-label={backLabel}
          >
            <ArrowLeft className="size-5 rtl:rotate-180" aria-hidden />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{title}</p>
            <p className="truncate text-xs text-ivory/70">{langLabel}</p>
          </div>
        </div>
      </div>
      <iframe
        title={`${title} (${langLabel})`}
        src={src}
        className="min-h-0 w-full flex-1 border-0 bg-white"
      />
    </div>,
    document.body,
  );
}
