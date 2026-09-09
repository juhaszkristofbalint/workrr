import { cn } from "@/lib/cn";

export function PhoneFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex min-h-dvh justify-center bg-chrome sm:items-center sm:py-6">
      <div
        className={cn(
          "relative flex h-dvh w-full max-w-[390px] flex-col overflow-hidden bg-background text-foreground shadow-float sm:h-[844px] sm:max-h-[844px] sm:rounded-[47px] sm:ring-[10px] sm:ring-slate-950",
          className,
        )}
      >
        <div
          className="pointer-events-none absolute left-1/2 top-2.5 z-[60] hidden h-[34px] w-[126px] -translate-x-1/2 rounded-full bg-slate-950 sm:block"
          aria-hidden
        />
        {children}
      </div>
    </div>
  );
}
