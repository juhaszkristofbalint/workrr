import { EmptyJobsState } from "@/components/jobs/empty-jobs-state";
import { Tx } from "@/components/i18n/tx";
import { Badge, Card, ScreenHeader } from "@/components/ui";
import { getSession } from "@/lib/auth/session";
import { listAssignedJobs } from "@/lib/jobs/queries";

export default async function ProSchedulePage() {
  const user = await getSession();
  const jobs = user ? await listAssignedJobs(user.id) : [];

  return (
    <div className="flex flex-col gap-4 px-5">
      <ScreenHeader
        eyebrow={<Tx k="schedule.eyebrow" />}
        title={<Tx k="schedule.title" />}
      />
      {jobs.length === 0 ? (
        <EmptyJobsState />
      ) : (
        jobs.map((job) => (
          <Card key={job.id}>
            <p className="text-body font-semibold">{job.preferredDate ?? job.posted}</p>
            <p className="text-footnote text-muted">
              {job.title}
              {job.customerName ? ` · ${job.customerName}` : ""}
            </p>
            <Badge className="mt-2 capitalize">{job.status}</Badge>
          </Card>
        ))
      )}
    </div>
  );
}
