import { EmptyJobsState } from "@/components/jobs/empty-jobs-state";
import { Badge, Card } from "@/components/ui";
import { listMatchedJobs } from "@/lib/jobs/queries";

export default async function AdminBookingsPage() {
  const jobs = await listMatchedJobs();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-large-title font-bold tracking-tight">Bookings</h1>
      {jobs.length === 0 ? (
        <EmptyJobsState />
      ) : (
        jobs.map((job) => (
          <Card key={job.id} className="flex items-center justify-between">
            <div>
              <p className="text-body font-semibold">
                {job.customerName || "Customer"}
                {job.assignedProfessional
                  ? ` → ${job.assignedProfessional}`
                  : ""}
              </p>
              <p className="text-footnote text-muted">
                {job.title} · {job.posted}
              </p>
            </div>
            <Badge className="capitalize">{job.status}</Badge>
          </Card>
        ))
      )}
    </div>
  );
}
