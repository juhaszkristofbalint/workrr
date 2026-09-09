import { redirect } from "next/navigation";

export default function ReportProblemRedirectPage() {
  redirect("/customer/jobs/new");
}
