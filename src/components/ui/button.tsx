import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors duration-(--motion-quick,150ms) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-ink text-white hover:bg-ink-hover shadow-sm",
        brand: "bg-brand text-white hover:bg-brand-hover shadow-sm",
        secondary: "bg-surface-2 text-ink hover:bg-border",
        outline: "border border-border-strong bg-surface text-ink hover:bg-surface-2",
        ghost: "text-ink hover:bg-surface-2",
        danger: "bg-danger text-white hover:bg-danger/90",
        navy: "bg-navy text-white hover:bg-navy-2",
        link: "text-brand underline-offset-4 hover:underline px-0",
      },
      size: {
        default: "h-10 rounded-lg px-4 text-sm",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-lg px-5 text-sm",
        icon: "size-9 rounded-lg",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
