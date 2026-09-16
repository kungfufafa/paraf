import { cn } from "@/lib/utils";

export function Checkbox({
  checked,
  onChange,
  className,
}: {
  checked?: boolean;
  onChange?: (v: boolean) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "grid size-4 shrink-0 place-items-center rounded-xs border transition-colors",
        checked ? "border-brand bg-brand text-white" : "border-border-strong bg-surface",
        className,
      )}
    >
      {checked ? (
        <svg viewBox="0 0 12 12" className="size-3" fill="none">
          <path d="M2 6.2 4.6 9 10 3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      ) : null}
    </button>
  );
}
