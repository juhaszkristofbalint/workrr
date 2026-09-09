import { ProRegistrationForm } from "@/components/auth/pro-registration-form";

export default async function ProSignupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : undefined;
  return <ProRegistrationForm error={error} />;
}
