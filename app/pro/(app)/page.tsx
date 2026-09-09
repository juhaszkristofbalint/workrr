import { ProDashboard } from "@/components/pro/dashboard";
import { getSession } from "@/lib/auth/session";

export default async function ProHomePage() {
  const user = await getSession();
  const name = user?.displayName.split(" ")[0] ?? "";
  const trade = user?.trade ?? "";

  return <ProDashboard name={name} trade={trade} />;
}
