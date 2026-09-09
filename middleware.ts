import { NextResponse, type NextRequest } from "next/server";
import {
  APP_HOME,
  isPublicAuthPath,
  LOGIN_PATH,
  roleFromPath,
} from "@/lib/auth/config";
import { getRequestSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { response, user } = await getRequestSession(request);
  const { pathname } = request.nextUrl;
  const appRole = roleFromPath(pathname);

  if (!appRole) return response;

  if (isPublicAuthPath(pathname)) {
    if (user?.role === appRole) {
      return NextResponse.redirect(new URL(APP_HOME[appRole], request.url));
    }
    return response;
  }

  if (!user) {
    const login = new URL(LOGIN_PATH[appRole], request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (user.role !== appRole) {
    return NextResponse.redirect(new URL(APP_HOME[user.role], request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/customer",
    "/customer/:path*",
    "/pro",
    "/pro/:path*",
    "/admin",
    "/admin/:path*",
  ],
};
