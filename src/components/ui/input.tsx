import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-ink placeholder:text-subtle outline-none transition-shadow focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
