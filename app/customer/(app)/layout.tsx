import { MobileAppShell } from "@/components/layout/mobile-app-shell";
import { requireRole } from "@/lib/auth/require-role";

export default async function CustomerAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("customer");
  return <MobileAppShell role="customer">{children}</MobileAppShell>;
}
