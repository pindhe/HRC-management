"use client";

import Image from "next/image";
import { useTheme } from "@/lib/theme";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const markSizes = {
  sm: { box: "size-9", sizes: "36px" },
  md: { box: "size-11", sizes: "44px" },
  lg: { box: "size-[4.5rem] sm:size-20", sizes: "80px" },
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
        "relative block aspect-square shrink-0 overflow-hidden rounded-full",
        dark
          ? "bg-black ring-1 ring-ivory/18"
          : "bg-white ring-1 ring-forest/12",
        mark.box,
        className,
      )}
    >
      <Image
        src={dark ? site.logoDark : site.logoLight}
        alt=""
        fill
        sizes={mark.sizes}
        className="object-contain p-[7%]"
        priority={priority}
      />
    </span>
  );
}

export function Logo({
  compact = false,
  light = false,
  stacked = false,
  priority = false,
  surface = "auto",
  className,
}: {
  compact?: boolean;
  light?: boolean;
  stacked?: boolean;
  priority?: boolean;
  surface?: "auto" | "light" | "dark";
  className?: string;
}) {
  return (
    <span
      aria-label={site.name}
      className={cn(
        "flex min-w-0",
        stacked ? "flex-col items-center gap-3.5 text-center" : "items-center gap-3",
        className,
      )}
    >
      <LogoMark
        size={stacked ? "lg" : compact ? "sm" : "md"}
        priority={priority}
        surface={surface}
      />
      <span className={cn("min-w-0 leading-none", stacked && "text-center")}>
        <span
          className={cn(
            "font-heading block font-semibold tracking-[0.14em]",
            stacked ? "text-3xl sm:text-4xl" : compact ? "text-[1.05rem]" : "text-xl",
            light ? "text-ivory" : "text-forest",
          )}
        >
          {site.shortName}
        </span>
        <span
          className={cn(
            "mt-1 block font-medium tracking-[0.22em] uppercase",
            stacked ? "text-[11px] sm:text-xs" : "text-[9px]",
            light ? "text-gold" : "text-forest-mid dark:text-gold",
          )}
        >
          Reading Club
        </span>
      </span>
    </span>
  );
}
