"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { images } from "@/lib/images";
import { cn } from "@/lib/utils";

export function ClubBackdrop({
  alt,
  priority = false,
  strength = "soft",
  alive = false,
}: {
  alt: string;
  priority?: boolean;
  strength?: "soft" | "medium";
  alive?: boolean;
}) {
  const reduce = useReducedMotion();
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    function sync() {
      setDesktop(media.matches);
    }
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const move = alive && !reduce;

  return (
    <>
      <motion.div
        className="absolute inset-0"
        animate={
          move
            ? { scale: desktop ? [1.04, 1.12, 1.04] : [1.02, 1.05, 1.02] }
            : undefined
        }
        transition={
          move
            ? { duration: desktop ? 28 : 18, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      >
        <Image
          src={images.club}
          alt={alt}
          fill
          priority={priority}
          quality={92}
          sizes="100vw"
          className="object-cover object-[center_22%] md:object-[center_42%]"
        />
      </motion.div>
      <div
        className={cn(
          "absolute inset-0",
          strength === "soft"
            ? "bg-forest-deep/10 md:bg-forest-deep/16"
            : "bg-forest-deep/24 md:bg-forest-deep/32",
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-b",
          strength === "soft"
            ? "from-forest-deep/45 via-transparent to-forest-deep/40 md:from-forest-deep/50 md:to-forest-deep/55"
            : "from-forest-deep/50 via-forest-deep/10 to-forest-deep/50 md:from-forest-deep/60 md:via-forest-deep/15 md:to-forest-deep/65",
        )}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_28%,rgba(13,40,24,0.42)_100%)] md:bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(13,40,24,0.55)_100%)]" />
    </>
  );
}
