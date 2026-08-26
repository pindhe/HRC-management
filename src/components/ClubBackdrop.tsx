"use client";

import Image from "next/image";
import { images } from "@/lib/images";
import { cn } from "@/lib/utils";

export function ClubBackdrop({
  alt,
  priority = false,
  strength = "soft",
}: {
  alt: string;
  priority?: boolean;
  strength?: "soft" | "medium";
}) {
  return (
    <>
      <Image
        src={images.club}
        alt={alt}
        fill
        priority={priority}
        quality={92}
        sizes="100vw"
        className="scale-[1.02] object-cover object-[center_42%]"
      />
      <div
        className={cn(
          "absolute inset-0",
          strength === "soft" ? "bg-forest-deep/18" : "bg-forest-deep/32",
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-b",
          strength === "soft"
            ? "from-forest-deep/55 via-transparent to-forest-deep/50"
            : "from-forest-deep/60 via-forest-deep/15 to-forest-deep/65",
        )}
      />
    </>
  );
}
