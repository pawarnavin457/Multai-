import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-[transform,background-color,color,box-shadow,border-color] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest",
  {
    variants: {
      variant: {
        primary:
          "bg-forest text-surface hover:bg-forest-deep shadow-[0_1px_0_rgba(255,255,255,0.12)_inset]",
        secondary:
          "bg-surface text-ink border border-line hover:border-line-strong hover:bg-surface-2",
        ghost: "text-ink-soft hover:bg-leaf hover:text-ink",
        inverse: "bg-ink text-bg hover:bg-ink-soft",
      },
      size: {
        sm: "h-9 px-3 text-sm rounded-[10px]",
        md: "h-11 px-4 text-sm rounded-xl",
        lg: "h-12 px-5 text-[15px] rounded-[14px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
