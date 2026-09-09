import { MobileAppShell } from "@/components/layout/mobile-app-shell";
import { requireRole } from "@/lib/auth/require-role";

export default async function ProAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("professional");
  return <MobileAppShell role="professional">{children}</MobileAppShell>;
}
