import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-primary text-primary-foreground shadow-sm active:bg-secondary",
  secondary:
    "bg-secondary text-secondary-foreground shadow-sm active:opacity-90",
  outline:
    "border border-separator bg-card text-foreground active:bg-fill",
  ghost: "bg-fill text-foreground active:opacity-80",
  glass:
    "bg-white/18 text-white shadow-none backdrop-blur-md active:scale-95",
} as const;

const sizes = {
  sm: "min-h-9 rounded-md px-3 text-footnote font-semibold",
  md: "min-h-11 rounded-lg px-4 text-subhead font-semibold",
  lg: "min-h-12 rounded-xl px-5 text-body font-semibold",
  icon: "h-11 w-11 rounded-full",
} as const;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 transition-transform active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

export function buttonClassName({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center gap-1.5 transition-transform active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40",
    variants[variant],
    sizes[size],
    className,
  );
}
