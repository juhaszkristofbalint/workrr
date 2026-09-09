import { Tx } from "@/components/i18n/tx";
import { ProfileCard } from "@/components/auth/profile-card";
import { ScreenHeader } from "@/components/ui";
import { requireRole } from "@/lib/auth/require-role";

export default async function CustomerProfilePage() {
  const user = await requireRole("customer");

  return (
    <div className="flex flex-col gap-4">
      <div className="px-5">
        <ScreenHeader
          eyebrow={<Tx k="profile.eyebrow" />}
          title={<Tx k="profile.title" />}
        />
      </div>
      <ProfileCard user={user} />
    </div>
  );
}
