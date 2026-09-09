import { CustomerHome } from "@/components/customer/home-screen";
import { getSession } from "@/lib/auth/session";

export default async function CustomerHomePage() {
  const user = await getSession();
  const name = user?.displayName.split(" ")[0] ?? "";

  return <CustomerHome name={name} />;
}
