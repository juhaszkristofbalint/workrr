import type { User } from "@supabase/supabase-js";
import { isUserRole, type SessionUser } from "@/types/auth";

export function mapSupabaseUser(user: User): SessionUser {
  const metadata = user.user_metadata ?? {};
  const roleValue = metadata.role;
  const role = isUserRole(roleValue) ? roleValue : "customer";

  return {
    id: user.id,
    email: user.email ?? "",
    displayName:
      (typeof metadata.display_name === "string" && metadata.display_name) ||
      user.email?.split("@")[0] ||
      "Member",
    role,
    trade: typeof metadata.trade === "string" ? metadata.trade : undefined,
  };
}
