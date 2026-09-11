import { CustomerHome } from "@/components/customer/home-screen";
import { getSession } from "@/lib/auth/session";
import { listCustomerJobs } from "@/lib/jobs/queries";

export default async function CustomerHomePage() {
  const user = await getSession();
  const name = user?.displayName.split(" ")[0] ?? "";
  const jobs = user ? await listCustomerJobs(user.id) : [];

  return <CustomerHome name={name} jobs={jobs} />;
}
