import { ProDashboard } from "@/components/pro/dashboard";
import { getSession } from "@/lib/auth/session";
import {
  getProfessionalLocation,
  listAssignedJobs,
  listJobNotifications,
  listOpenJobs,
} from "@/lib/jobs/queries";

export default async function ProHomePage() {
  const user = await getSession();
  const name = user?.displayName.split(" ")[0] ?? "";
  const trade = user?.trade ?? "";
  const origin = user ? await getProfessionalLocation(user.id) : null;
  const [nearbyJobs, activeJobs, notifications] = await Promise.all([
    listOpenJobs(origin),
    user ? listAssignedJobs(user.id) : Promise.resolve([]),
    user ? listJobNotifications(user.id) : Promise.resolve([]),
  ]);

  return (
    <ProDashboard
      name={name}
      trade={trade}
      nearbyJobs={nearbyJobs}
      origin={origin}
      activeJobs={activeJobs}
      notifications={notifications}
    />
  );
}
