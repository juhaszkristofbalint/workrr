export type UserRole = "customer" | "professional" | "admin";

export type SessionUser = {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  trade?: string;
};

export const ROLES: UserRole[] = ["customer", "professional", "admin"];

export function isUserRole(value: unknown): value is UserRole {
  return value === "customer" || value === "professional" || value === "admin";
}

export function isSessionUser(value: unknown): value is SessionUser {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.email === "string" &&
    typeof record.displayName === "string" &&
    isUserRole(record.role)
  );
}
