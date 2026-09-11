import { Card } from "@/components/ui";
import { EMPTY_JOBS_MESSAGE } from "@/lib/jobs/empty";

export function EmptyJobsState({
  className = "",
  message = EMPTY_JOBS_MESSAGE,
}: {
  className?: string;
  message?: string;
}) {
  return (
    <Card className={className}>
      <p className="px-2 py-8 text-center text-subhead text-muted">
        {EMPTY_JOBS_MESSAGE}
      </p>
    </Card>
  );
}
