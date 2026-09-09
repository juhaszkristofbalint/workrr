import { cn } from "@/lib/cn";

export function Page({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 px-5 pt-status sm:pt-14", className)}>
      {children}
    </div>
  );
}

export function ScreenHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex items-end justify-between gap-3">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-footnote font-medium text-muted">{eyebrow}</p>
        ) : null}
        <h1 className="truncate text-large-title font-bold tracking-tight">
          {title}
        </h1>
      </div>
      {action}
    </header>
  );
}
