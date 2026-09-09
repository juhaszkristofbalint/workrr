import { ProfessionalProfile } from "@/components/pro/professional-profile";
import { requireRole } from "@/lib/auth/require-role";

export default async function ProProfilePage() {
  const user = await requireRole("professional");
  return <ProfessionalProfile user={user} />;
}
