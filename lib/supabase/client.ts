import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

export function createSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
