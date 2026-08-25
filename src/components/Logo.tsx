import { cn } from "@/lib/utils";

export function Logo({
  compact = false,
  light = false,
  className,
}: {
  compact?: boolean;
  light?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded-xl border shadow-sm",
          light
            ? "border-gold/40 bg-ivory/10 text-gold"
            : "border-gold/40 bg-forest text-gold",
        )}
        aria-hidden
      >
        <svg viewBox="0 0 32 32" className="size-5" fill="none">
          <path
            d="M7 25V9.5c0-.8.6-1.5 1.5-1.5H16v17H8.5A1.5 1.5 0 0 1 7 25Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M16 8h7.5c.8 0 1.5.7 1.5 1.5V25a1.5 1.5 0 0 1-1.5 1.5H16V8Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M16 8v18"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="leading-tight">
        <span
          className={cn(
            "font-heading block text-lg font-semibold tracking-[0.18em]",
            light ? "text-ivory" : "text-forest",
          )}
        >
          HAGE
        </span>
        {!compact ? (
          <span
            className={cn(
              "block text-[11px] font-medium tracking-[0.16em] uppercase",
              light ? "text-ivory/70" : "text-muted",
            )}
          >
            Reading Club
          </span>
        ) : null}
      </span>
    </span>
  );
}
