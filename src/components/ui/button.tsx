import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-forest text-ivory shadow-[0_8px_24px_-12px_rgba(27,67,50,0.7)] hover:bg-forest-mid hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-12px_rgba(27,67,50,0.55)]",
        secondary:
          "border border-forest/20 bg-ivory/70 text-forest backdrop-blur-sm hover:border-gold hover:bg-ivory hover:text-forest-deep",
        gold: "bg-gold text-forest-deep shadow-[0_8px_24px_-12px_rgba(196,163,90,0.7)] hover:bg-gold-light hover:-translate-y-0.5",
        ghost: "text-forest hover:bg-forest/8",
        outline:
          "border border-ivory/40 bg-transparent text-ivory hover:border-gold hover:bg-ivory/10",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
