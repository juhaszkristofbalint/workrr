import { cn } from "@/lib/cn";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full resize-y rounded-lg border border-separator bg-fill px-4 py-3 text-body text-foreground shadow-xs outline-none transition placeholder:text-muted",
        "focus:border-primary focus:bg-card focus:ring-2 focus:ring-accent/40",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}
