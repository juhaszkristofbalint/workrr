import { AdminDashboard } from "@/components/admin/dashboard";
import { listAllJobs } from "@/lib/jobs/queries";

export default async function AdminOverviewPage() {
  const jobs = await listAllJobs();
  return <AdminDashboard jobs={jobs.slice(0, 8)} />;
}
