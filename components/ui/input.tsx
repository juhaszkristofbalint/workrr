import { cn } from "@/lib/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "min-h-11 w-full rounded-lg border border-separator bg-fill px-4 text-body text-foreground shadow-xs outline-none transition placeholder:text-muted",
        "focus:border-primary focus:bg-card focus:ring-2 focus:ring-accent/40",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-footnote font-medium text-muted">{label}</span>
      {children}
      {hint ? <span className="text-caption text-muted">{hint}</span> : null}
    </label>
  );
}
