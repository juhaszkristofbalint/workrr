import { AdminAppShell } from "@/components/layout/admin-app-shell";
import { requireRole } from "@/lib/auth/require-role";

export default async function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("admin");
  return <AdminAppShell>{children}</AdminAppShell>;
}
