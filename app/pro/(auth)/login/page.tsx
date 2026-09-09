import { AuthForm } from "@/components/auth/auth-form";

export default async function ProLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : undefined;
  return <AuthForm role="professional" mode="login" error={error} />;
}
