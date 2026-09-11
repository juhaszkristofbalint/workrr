import { EmptyJobsState } from "@/components/jobs/empty-jobs-state";
import { Tx } from "@/components/i18n/tx";
import { Badge, Card, ScreenHeader } from "@/components/ui";
import { getSession } from "@/lib/auth/session";
import { isLocale, LOCALE_COOKIE, type AppLocale } from "@/lib/i18n/locale";
import { jobStatusLabel, translate } from "@/lib/i18n/translate";
import { listMyJobs } from "@/lib/jobs/queries";
import { cn } from "@/lib/cn";
import { cookies } from "next/headers";
import Link from "next/link";

const stageTone: Record<string, string> = {
  open: "bg-accent/15 text-primary",
  accepted: "bg-success-soft text-success",
  completed: "bg-fill text-label",
};

function stageLabel(locale: AppLocale, stage: string, status: string) {
  if (stage === "open") return translate(locale, "jobs.statusOpen");
  if (stage === "accepted") return translate(locale, "jobs.statusAccepted");
  if (stage === "completed") return translate(locale, "jobs.statusCompleted");
  return jobStatusLabel(locale, status);
}

export default async function MyJobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const created = params.created === "1";
  const stored = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale = isLocale(stored) ? stored : "en";
  const user = await getSession();
  const jobs = user ? await listMyJobs(user.id) : [];

  return (
    <div className="flex flex-col gap-4 px-5">
      <ScreenHeader
        eyebrow={<Tx k="jobs.eyebrow" />}
        title={<Tx k="jobs.title" />}
        action={
          <Link
            href="/customer/jobs/new"
            className="text-footnote font-semibold text-primary"
          >
            <Tx k="jobs.new" />
          </Link>
        }
      />
      {created ? (
        <p className="rounded-lg bg-success-soft px-3 py-2 text-footnote text-success">
          <Tx k="jobs.submitted" />
        </p>
      ) : null}
      {jobs.length === 0 ? (
        <EmptyJobsState message={translate(locale, "jobs.empty")} />
      ) : (
        <ul className="flex flex-col gap-3">
          {jobs.map((job) => (
            <li key={job.id}>
              <Link href={`/customer/jobs/${job.id}`}>
                <Card className="flex gap-3 active:scale-[0.99]">
                  {job.photos[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={job.photos[0].src}
                      alt=""
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="text-body font-semibold">{job.title}</h2>
                        <p className="mt-0.5 text-footnote text-muted">
                          {job.category} · {job.posted}
                        </p>
                      </div>
                      <Badge className={cn("shrink-0 capitalize", stageTone[job.stage])}>
                        {stageLabel(locale, job.stage, job.status)}
                      </Badge>
                    </div>
                    <p className="mt-2 text-footnote font-medium text-label">
                      {translate(locale, "jobs.offers", { n: job.offerCount })}
                    </p>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
