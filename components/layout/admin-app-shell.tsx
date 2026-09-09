import { AdminSidebar } from "@/components/layout/admin-sidebar";

export function AdminAppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-background text-foreground">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-y-auto px-8 py-8">{children}</main>
    </div>
  );
}
