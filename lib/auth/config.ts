import type { UserRole } from "@/types/auth";

export const SESSION_COOKIE = "workrr.session";

export const APP_HOME: Record<UserRole, string> = {
  customer: "/customer",
  professional: "/pro",
  admin: "/admin",
};

export const LOGIN_PATH: Record<UserRole, string> = {
  customer: "/customer/login",
  professional: "/pro/login",
  admin: "/admin/login",
};

export const PUBLIC_AUTH_PATHS = [
  "/customer/login",
  "/customer/signup",
  "/pro/login",
  "/pro/signup",
  "/admin/login",
] as const;

export function roleFromPath(pathname: string): UserRole | null {
  if (pathname === "/customer" || pathname.startsWith("/customer/")) {
    return "customer";
  }
  if (pathname === "/pro" || pathname.startsWith("/pro/")) {
    return "professional";
  }
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return "admin";
  }
  return null;
}

export function isPublicAuthPath(pathname: string) {
  return PUBLIC_AUTH_PATHS.includes(
    pathname as (typeof PUBLIC_AUTH_PATHS)[number],
  );
}
