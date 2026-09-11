import { Tx } from "@/components/i18n/tx";
import { JobDetails } from "@/components/customer/job-details";
import { getCustomerJob } from "@/lib/jobs/queries";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CustomerJobDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const acceptedId = typeof query.accepted === "string" ? query.accepted : undefined;
  const job = await getCustomerJob(id);

  if (!job) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="px-5">
        <Link
          href="/customer/jobs"
          className="text-footnote font-semibold text-primary"
        >
          <Tx k="jobs.back" />
        </Link>
      </div>
      <JobDetails job={job} justAccepted={Boolean(acceptedId)} />
    </div>
  );
}
