import { NearbyJobsFeed } from "@/components/pro/nearby-jobs-feed";
import { getSession } from "@/lib/auth/session";
import {
  getProfessionalLocation,
  listMyOfferedJobIds,
  listOpenJobs,
} from "@/lib/jobs/queries";

export default async function ProRequestsPage() {
  const user = await getSession();
  const origin = user ? await getProfessionalLocation(user.id) : null;
  const jobs = await listOpenJobs(origin);
  const offeredJobIds = user ? await listMyOfferedJobIds(user.id) : [];

  return (
    <NearbyJobsFeed
      jobs={jobs}
      offeredJobIds={offeredJobIds}
      origin={origin}
    />
  );
}
