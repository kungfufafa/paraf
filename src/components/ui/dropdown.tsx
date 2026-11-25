import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export const Menu = DropdownMenu.Root;
export const MenuTrigger = DropdownMenu.Trigger;

export function MenuContent({
  className,
  children,
  align = "end",
}: {
  className?: string;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
}) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        align={align}
        sideOffset={6}
        className={cn(
          "z-50 min-w-44 rounded-xl border border-border bg-surface p-1 shadow-soft",
          className,
        )}
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
}

export function MenuItem({
  children,
  onSelect,
  danger,
  disabled,
}: {
  children: React.ReactNode;
  onSelect?: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <DropdownMenu.Item
      disabled={disabled}
      onSelect={onSelect}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] outline-none data-[highlighted]:bg-surface-2",
        danger ? "text-danger hover:bg-danger-soft" : "text-ink hover:bg-surface-2",
        disabled && "opacity-40",
      )}
    >
      {children}
    </DropdownMenu.Item>
  );
}

export function MenuSep() {
  return <DropdownMenu.Separator className="my-1 h-px bg-border" />;
}
