import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  compact = false,
  light = false,
  priority = false,
  className,
}: {
  compact?: boolean;
  light?: boolean;
  priority?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "relative size-10 shrink-0 overflow-hidden rounded-full bg-white shadow-sm ring-1",
          light ? "ring-ivory/20" : "ring-forest/10",
        )}
      >
        <Image
          src="/logo.jpg"
          alt=""
          fill
          sizes="40px"
          className="object-cover"
          priority={priority}
        />
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
