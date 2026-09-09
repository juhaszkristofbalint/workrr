import { cn } from "@/lib/cn";

export function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-fill px-2.5 py-1 text-caption font-semibold text-label",
        className,
      )}
    >
      {children}
    </span>
  );
}
