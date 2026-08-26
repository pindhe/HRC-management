"use client";

import { useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/book-dates";
import { deletePayment, type Payment } from "@/lib/club-store";
import { useI18n } from "@/lib/i18n/language-provider";
import { localeMeta } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";

type Dialog = { type: "view" | "delete"; payment: Payment } | null;

function formatDay(dateKey: string, locale: string) {
  const date = dateKey.includes("T")
    ? new Date(dateKey)
    : new Date(`${dateKey}T12:00:00`);
  if (!Number.isFinite(date.getTime())) return dateKey;
  return date.toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function paymentKind(
  payment: Payment,
  t: { fineBook: string; fineAbsence: string; cash: string; transfer: string; mobile: string },
) {
  if (payment.fineType === "book") return t.fineBook;
  if (payment.fineType === "absence") return t.fineAbsence;
  return t[payment.method];
}

export function PaymentHistory({
  payments,
  onChange,
}: {
  payments: Payment[];
  onChange?: () => void;
}) {
  const { t, locale } = useI18n();
  const htmlLang = localeMeta[locale].htmlLang;
  const [dialog, setDialog] = useState<Dialog>(null);

  function closeDialog() {
    setDialog(null);
  }

  function confirmDelete() {
    if (dialog?.type !== "delete") return;
    deletePayment(dialog.payment.id);
    onChange?.();
    closeDialog();
  }

  return (
    <>
      {payments.length === 0 ? (
        <p className="mt-6 text-sm text-muted">{t.cashier.empty}</p>
      ) : (
        <ul className="mt-5 divide-y divide-forest/10">
          {payments.map((payment) => {
            const kind = paymentKind(payment, t.cashier);
            return (
              <li key={payment.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-medium text-forest-deep">
                    {payment.memberName}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {[
                      kind,
                      payment.fineDate && formatDay(payment.fineDate, htmlLang),
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <p className="mt-1 text-base font-semibold text-forest">
                    {payment.amount.toLocaleString(locale)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setDialog({ type: "view", payment })}
                  >
                    {t.cashier.viewPayment}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="bg-red-700 text-white hover:bg-red-800"
                    onClick={() => setDialog({ type: "delete", payment })}
                  >
                    {t.cashier.deletePayment}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {dialog?.type === "view" ? (
        <HistoryDialog title={t.cashier.viewPayment} onClose={closeDialog}>
          <PaymentView payment={dialog.payment} />
        </HistoryDialog>
      ) : null}

      {dialog?.type === "delete" ? (
        <HistoryDialog
          title={t.cashier.confirmDeletePayment}
          onClose={closeDialog}
          footer={
            <>
              <Button type="button" variant="secondary" onClick={closeDialog}>
                {t.admin.cancel}
              </Button>
              <Button
                type="button"
                onClick={confirmDelete}
                className="bg-red-700 text-white hover:bg-red-800"
              >
                {t.cashier.deletePayment}
              </Button>
            </>
          }
        >
          <p className="text-sm leading-relaxed text-muted">
            {t.cashier.confirmDeletePaymentText.replace(
              "{name}",
              dialog.payment.memberName,
            )}
          </p>
        </HistoryDialog>
      ) : null}
    </>
  );
}

function PaymentView({ payment }: { payment: Payment }) {
  const { t, locale } = useI18n();
  const htmlLang = localeMeta[locale].htmlLang;
  const kind = paymentKind(payment, t.cashier);

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <DetailItem label={t.cashier.memberName} value={payment.memberName} />
      <DetailItem label={t.cashier.fineType} value={kind} />
      <DetailItem
        label={t.cashier.selectDay}
        value={payment.fineDate ? formatDay(payment.fineDate, htmlLang) : "—"}
      />
      <DetailItem
        label={t.cashier.amount}
        value={payment.amount.toLocaleString(locale)}
      />
      <DetailItem label={t.cashier.method} value={t.cashier[payment.method]} />
      <DetailItem
        label={t.cashier.recordedAt}
        value={formatDateTime(payment.createdAt, htmlLang)}
      />
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
        {label}
      </p>
      <p className="mt-1 break-words text-sm text-forest-deep">{value || "—"}</p>
    </div>
  );
}

function HistoryDialog({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { t } = useI18n();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label={t.admin.close}
        className="absolute inset-0 bg-forest-deep/55 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-dialog-title"
        className={cn(
          "relative z-10 flex max-h-[92svh] w-full flex-col rounded-t-3xl border border-forest/10 bg-ivory shadow-2xl sm:max-w-lg sm:rounded-3xl",
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-forest/10 px-5 py-4">
          <h2 id="payment-dialog-title" className="font-heading text-xl text-forest">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted hover:bg-beige hover:text-forest"
            aria-label={t.admin.close}
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer ? (
          <div className="flex justify-end gap-3 border-t border-forest/10 px-5 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
