export type MyJobStage = "open" | "accepted" | "completed" | "other";

export function myJobStage(status: string): MyJobStage {
  const normalized = status.replaceAll("_", " ");
  if (normalized === "open") return "open";
  if (normalized === "completed") return "completed";
  if (
    normalized === "matched" ||
    normalized === "en route" ||
    normalized === "in progress" ||
    normalized === "accepted"
  ) {
    return "accepted";
  }
  return "other";
}
