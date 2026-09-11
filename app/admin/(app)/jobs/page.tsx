import { JobsModeration } from "@/components/admin/jobs-moderation";
import { listAllJobs } from "@/lib/jobs/queries";

export default async function AdminJobsPage() {
  const jobs = await listAllJobs();
  return <JobsModeration jobs={jobs} />;
}
