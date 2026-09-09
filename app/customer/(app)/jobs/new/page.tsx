import { Tx } from "@/components/i18n/tx";
import { CreateJobForm } from "@/components/customer/create-job-form";
import { ScreenHeader } from "@/components/ui";
import Link from "next/link";

export default async function CreateJobPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : undefined;
  const openCamera = params.camera === "1";

  return (
    <div className="flex flex-col">
      <div className="flex items-start justify-between gap-3 px-5 pb-3">
        <ScreenHeader
          eyebrow={<Tx k="createJob.eyebrow" />}
          title={<Tx k="createJob.title" />}
        />
        <Link href="/customer" className="text-footnote font-semibold text-primary">
          <Tx k="common.cancel" />
        </Link>
      </div>
      <CreateJobForm openCamera={openCamera} error={error} />
    </div>
  );
}
