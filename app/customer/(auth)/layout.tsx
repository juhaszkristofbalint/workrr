import { MobileAuthShell } from "@/components/layout/mobile-auth-shell";

export default function CustomerAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileAuthShell>{children}</MobileAuthShell>;
}
