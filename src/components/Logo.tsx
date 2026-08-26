"use client";

import Image from "next/image";
import { useTheme } from "@/lib/theme";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const markSizes = {
  sm: { box: "size-9", sizes: "36px" },
  md: { box: "size-10", sizes: "40px" },
  lg: { box: "size-16 sm:size-20", sizes: "80px" },
} as const;

export function LogoMark({
  size = "md",
  priority = false,
  surface = "auto",
  className,
}: {
  size?: keyof typeof markSizes;
  priority?: boolean;
  surface?: "auto" | "light" | "dark";
  className?: string;
}) {
  const { theme } = useTheme();
  const mark = markSizes[size];
  const dark =
    surface === "dark" || (surface === "auto" && theme === "dark");

  return (
    <span
      className={cn(
        "relative block aspect-square shrink-0 overflow-hidden rounded-full shadow-[0_8px_20px_-10px_rgba(25,97,194,0.65)] ring-2 ring-logo-blue/70",
        dark ? "bg-black" : "bg-white",
        mark.box,
        className,
      )}
    >
      <Image
        src={dark ? site.logoDark : site.logoLight}
        alt=""
        fill
        sizes={mark.sizes}
        className="object-cover"
        priority={priority}
      />
    </span>
  );
}

export function Logo({
  compact = false,
  light = false,
  priority = false,
  surface = "auto",
  className,
}: {
  compact?: boolean;
  light?: boolean;
  priority?: boolean;
  surface?: "auto" | "light" | "dark";
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark size="md" priority={priority} surface={surface} />
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
