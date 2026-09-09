import { UserManagement } from "@/components/admin/user-management";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const roleParam = params.role;
  const initialRole =
    roleParam === "customer" || roleParam === "professional" ? roleParam : "all";

  return <UserManagement initialRole={initialRole} />;
}
