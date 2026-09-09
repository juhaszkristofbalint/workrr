import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth/config";
import { mapSupabaseUser } from "@/lib/auth/map-user";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSessionUser, type SessionUser } from "@/types/auth";

export async function getSession(): Promise<SessionUser | null> {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user ? mapSupabaseUser(user) : null;
  }

  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return isSessionUser(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
