import { AuthForm } from "@/components/auth/auth-form";

export default async function CustomerSignupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : undefined;
  return <AuthForm role="customer" mode="signup" error={error} />;
}
