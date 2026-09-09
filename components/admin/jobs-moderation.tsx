"use client";

import { Badge, Button, Card } from "@/components/ui";
import {
  moderatedJobs,
  type ModeratedJob,
  type ModeratedJobStatus,
} from "@/lib/data/admin-jobs";
import { cn } from "@/lib/cn";
import { useMemo, useState } from "react";

type StatusFilter = "all" | ModeratedJobStatus;
type Dialog = { type: "remove"; job: ModeratedJob } | null;

const statusTone: Record<ModeratedJobStatus, string> = {
  open: "bg-fill text-label",
  matched: "bg-primary/12 text-primary",
  "en route": "bg-accent/15 text-primary",
  completed: "bg-success-soft text-success",
  removed: "bg-danger/10 text-danger",
};

const selectClass =
  "min-h-11 rounded-lg border border-separator bg-fill px-3 text-subhead outline-none focus:border-primary focus:ring-2 focus:ring-accent/40";

export function JobsModeration() {
  const [jobs, setJobs] = useState(moderatedJobs);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [dialog, setDialog] = useState<Dialog>(null);
  const [preview, setPreview] = useState<{ src: string; alt: string } | null>(
    null,
  );
  const [notice, setNotice] = useState("");

  const visible = useMemo(() => {
    return jobs.filter((job) => (status === "all" ? true : job.status === status));
  }, [jobs, status]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div>
        <p className="text-footnote font-medium text-muted">Trust & safety</p>
        <h1 className="text-large-title font-bold tracking-tight">
          Jobs moderation
        </h1>
        <p className="mt-1 text-subhead text-muted">
          {visible.length} of {jobs.length} jobs
        </p>
      </div>

      {notice ? (
        <p className="rounded-lg bg-success-soft px-3 py-2 text-footnote text-success">
          {notice}
        </p>
      ) : null}

      <Card className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label>
          <span className="mb-2 block text-footnote font-medium text-muted">
            Status
          </span>
          <select
            className={selectClass}
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as StatusFilter)
            }
          >
            <option value="all">All jobs</option>
            <option value="open">Open</option>
            <option value="matched">Matched</option>
            <option value="en route">En route</option>
            <option value="completed">Completed</option>
            <option value="removed">Removed</option>
          </select>
        </label>
      </Card>

      <div className="flex flex-col gap-4">
        {visible.map((job) => (
          <Card key={job.id} className="flex flex-col gap-4 p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-body font-semibold">{job.title}</h2>
                  <Badge className={cn("capitalize", statusTone[job.status])}>
                    {job.status}
                  </Badge>
                  {job.flagged && job.status !== "removed" ? (
                    <Badge className="bg-warning-soft text-warning">
                      Flagged
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-1 text-footnote text-muted">
                  {job.category} · {job.address} · {job.posted}
                </p>
                <p className="mt-2 max-w-3xl text-subhead text-label">
                  {job.description}
                </p>
              </div>
              {job.status === "removed" ? (
                <p className="shrink-0 text-footnote font-semibold text-danger">
                  Removed from marketplace
                </p>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 border-danger/30 text-danger"
                  onClick={() => setDialog({ type: "remove", job })}
                >
                  Remove job
                </Button>
              )}
            </div>

            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-fill px-4 py-3">
                <dt className="text-caption font-semibold uppercase tracking-wide text-muted">
                  Customer
                </dt>
                <dd className="mt-1 text-subhead font-semibold">
                  {job.customerName}
                </dd>
              </div>
              <div className="rounded-xl bg-fill px-4 py-3">
                <dt className="text-caption font-semibold uppercase tracking-wide text-muted">
                  Assigned professional
                </dt>
                <dd className="mt-1 text-subhead font-semibold">
                  {job.assignedProfessional ?? "Unassigned"}
                </dd>
              </div>
            </dl>

            <div>
              <p className="mb-2 text-caption font-semibold uppercase tracking-wide text-muted">
                Photos
              </p>
              <div className="flex flex-wrap gap-2">
                {job.photos.map((photo) => (
                  <button
                    key={photo.src + photo.alt}
                    type="button"
                    aria-label={`View photo: ${photo.alt}`}
                    className="overflow-hidden rounded-xl border border-separator bg-fill"
                    onClick={() =>
                      setPreview({ src: photo.src, alt: photo.alt })
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="h-24 w-32 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {visible.length === 0 ? (
        <Card>
          <p className="px-5 py-8 text-center text-footnote text-muted">
            No jobs match this status.
          </p>
        </Card>
      ) : null}

      {dialog?.type === "remove" ? (
        <ConfirmDialog
          title="Remove this job?"
          body={`${dialog.job.title} will be taken down and hidden from customers and professionals.`}
          confirmLabel="Remove job"
          onClose={() => setDialog(null)}
          onConfirm={() => {
            setJobs((current) =>
              current.map((job) =>
                job.id === dialog.job.id
                  ? { ...job, status: "removed", flagged: false }
                  : job,
              ),
            );
            setNotice(`Removed "${dialog.job.title}".`);
            setDialog(null);
          }}
        />
      ) : null}

      {preview ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-6"
          onClick={() => setPreview(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={preview.alt}
            className="w-full max-w-2xl overflow-hidden rounded-2xl bg-background shadow-float"
            onClick={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview.src}
              alt={preview.alt}
              className="max-h-[70vh] w-full object-contain bg-fill"
            />
            <div className="flex items-center justify-between gap-3 px-5 py-4">
              <p className="text-subhead text-muted">{preview.alt}</p>
              <Button variant="outline" size="sm" onClick={() => setPreview(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ConfirmDialog({
  title,
  body,
  confirmLabel,
  onClose,
  onConfirm,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-dialog-title"
        className="w-full max-w-md rounded-2xl bg-background p-6 shadow-float"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="job-dialog-title" className="text-title font-bold">
          {title}
        </h2>
        <p className="mt-2 text-subhead text-muted">{body}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-danger text-white active:opacity-90"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
