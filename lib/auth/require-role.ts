import { redirect } from "next/navigation";
import { LOGIN_PATH } from "@/lib/auth/config";
import { getSession } from "@/lib/auth/session";
import type { UserRole } from "@/types/auth";

export async function requireRole(role: UserRole) {
  const user = await getSession();

  if (!user) {
    redirect(LOGIN_PATH[role]);
  }

  if (user.role !== role) {
    redirect(LOGIN_PATH[user.role]);
  }

  return user;
}
