import { PhoneFrame } from "@/components/layout/phone-frame";

export function MobileAuthShell({ children }: { children: React.ReactNode }) {
  return (
    <PhoneFrame>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-[max(1.5rem,var(--safe-top))] pb-[max(1.5rem,var(--safe-bottom))] sm:pt-14">
        {children}
      </div>
    </PhoneFrame>
  );
}
