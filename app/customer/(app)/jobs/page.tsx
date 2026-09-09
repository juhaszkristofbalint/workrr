import { Tx } from "@/components/i18n/tx";
import { Badge, Card, ScreenHeader } from "@/components/ui";
import { isLocale, LOCALE_COOKIE } from "@/lib/i18n/locale";
import { jobStatusLabel } from "@/lib/i18n/translate";
import { cookies } from "next/headers";
import { customerBookings, recentCustomerRequests } from "@/lib/data/marketplace";
import Link from "next/link";

export default async function CustomerJobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const created = params.created === "1";
  const stored = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale = isLocale(stored) ? stored : "en";

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
      {recentCustomerRequests.map((request) => (
        <Link key={request.id} href={`/customer/jobs/${request.id}`}>
          <Card className="flex items-start justify-between gap-3 active:scale-[0.99]">
            <div>
              <h2 className="text-body font-semibold">{request.title}</h2>
              <p className="text-footnote text-muted">
                {request.trade} · {request.when}
              </p>
            </div>
            <Badge className="capitalize">
              {jobStatusLabel(locale, request.status)}
            </Badge>
          </Card>
        </Link>
      ))}
      {customerBookings.map((booking) => (
        <Card key={booking.id} className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-body font-semibold">{booking.professionalName}</h2>
            <p className="text-footnote text-muted">
              {booking.trade} · {booking.when}
            </p>
          </div>
          <Badge className="capitalize">
            {jobStatusLabel(locale, booking.status)}
          </Badge>
        </Card>
      ))}
    </div>
  );
}
