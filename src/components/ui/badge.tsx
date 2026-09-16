import { cn } from "@/lib/utils";
import type { DocStatus } from "@/lib/types";

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
}

const STATUS_CLASS: Record<DocStatus, string> = {
  draft: "bg-surface-2 text-muted",
  need_to_sign: "bg-brand-soft text-brand",
  waiting_for_others: "bg-info-soft text-info",
  pending_approval: "bg-warning-soft text-warning",
  scheduled: "bg-info-soft text-info",
  completed: "bg-success-soft text-success",
  declined: "bg-danger-soft text-danger",
  expired: "bg-surface-2 text-muted",
  voided: "bg-surface-2 text-subtle line-through",
};

export function StatusBadge({
  status,
  label,
}: {
  status: DocStatus;
  label: string;
}) {
  return <Badge className={STATUS_CLASS[status]}>{label}</Badge>;
}
