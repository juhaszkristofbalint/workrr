import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isSessionUser, type SessionUser } from "@/types/auth";
import { SESSION_COOKIE } from "@/lib/auth/config";
import { mapSupabaseUser } from "@/lib/auth/map-user";
import type { Database } from "@/types/database";

export async function getRequestSession(request: NextRequest): Promise<{
  response: NextResponse;
  user: SessionUser | null;
}> {
  const response = NextResponse.next({ request });

  if (isSupabaseConfigured()) {
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    return { response, user: user ? mapSupabaseUser(user) : null };
  }

  const raw = request.cookies.get(SESSION_COOKIE)?.value;
  if (!raw) return { response, user: null };

  try {
    const parsed: unknown = JSON.parse(raw);
    return { response, user: isSessionUser(parsed) ? parsed : null };
  } catch {
    return { response, user: null };
  }
}
