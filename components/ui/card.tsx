import { cn } from "@/lib/cn";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl bg-card p-4 shadow-card",
        className,
      )}
    >
      {children}
    </section>
  );
}
