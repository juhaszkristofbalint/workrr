import { MobileAuthShell } from "@/components/layout/mobile-auth-shell";

export default function ProAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileAuthShell>{children}</MobileAuthShell>;
}
