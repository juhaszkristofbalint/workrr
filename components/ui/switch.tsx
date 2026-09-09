import { cn } from "@/lib/cn";

export function Switch({
  checked,
  onCheckedChange,
  label,
  description,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-subhead font-semibold">{label}</p>
        {description ? (
          <p className="text-footnote text-muted">{description}</p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative h-8 w-14 shrink-0 rounded-full transition-colors",
          checked ? "bg-danger" : "bg-fill",
        )}
      >
        <span
          className={cn(
            "absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform",
            checked && "translate-x-6",
          )}
        />
      </button>
    </div>
  );
}
