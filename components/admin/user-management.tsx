"use client";

import { Badge, Button, Card, Field, Input } from "@/components/ui";
import {
  managedUsers,
  type ManagedUser,
  type ManagedUserRole,
  type ManagedUserStatus,
} from "@/lib/data/admin-users";
import { useMemo, useState } from "react";

type RoleFilter = "all" | ManagedUserRole;
type StatusFilter = "all" | ManagedUserStatus;
type VerifyFilter = "all" | "verified" | "unverified";
type Dialog =
  | { type: "ban"; user: ManagedUser }
  | { type: "verify"; user: ManagedUser }
  | { type: "delete"; user: ManagedUser }
  | { type: "edit"; user: ManagedUser }
  | null;

const selectClass =
  "min-h-11 rounded-lg border border-separator bg-fill px-3 text-subhead outline-none focus:border-primary focus:ring-2 focus:ring-accent/40";

export function UserManagement({
  initialRole = "all",
}: {
  initialRole?: RoleFilter;
}) {
  const [users, setUsers] = useState(managedUsers);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<RoleFilter>(initialRole);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [verify, setVerify] = useState<VerifyFilter>("all");
  const [dialog, setDialog] = useState<Dialog>(null);
  const [notice, setNotice] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((user) => {
      if (role !== "all" && user.role !== role) return false;
      if (status !== "all" && user.status !== status) return false;
      if (verify === "verified" && !user.verified) return false;
      if (verify === "unverified" && user.verified) return false;
      if (!q) return true;
      return [user.name, user.email, user.city, user.trade ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [query, role, status, users, verify]);

  function patch(id: string, update: Partial<ManagedUser>) {
    setUsers((current) =>
      current.map((user) => (user.id === id ? { ...user, ...update } : user)),
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div>
        <p className="text-footnote font-medium text-muted">Admin</p>
        <h1 className="text-large-title font-bold tracking-tight">
          User management
        </h1>
        <p className="mt-1 text-subhead text-muted">
          {filtered.length} of {users.length} accounts
        </p>
      </div>

      {notice ? (
        <p className="rounded-lg bg-success-soft px-3 py-2 text-footnote text-success">
          {notice}
        </p>
      ) : null}

      <Card className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <label className="min-w-0 flex-1">
          <span className="mb-2 block text-footnote font-medium text-muted">
            Search
          </span>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, email, city, trade"
            aria-label="Search users"
          />
        </label>
        <label>
          <span className="mb-2 block text-footnote font-medium text-muted">
            Role
          </span>
          <select
            className={selectClass}
            value={role}
            onChange={(event) => setRole(event.target.value as RoleFilter)}
          >
            <option value="all">All</option>
            <option value="customer">Customers</option>
            <option value="professional">Professionals</option>
          </select>
        </label>
        <label>
          <span className="mb-2 block text-footnote font-medium text-muted">
            Status
          </span>
          <select
            className={selectClass}
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
        </label>
        <label>
          <span className="mb-2 block text-footnote font-medium text-muted">
            Verification
          </span>
          <select
            className={selectClass}
            value={verify}
            onChange={(event) => setVerify(event.target.value as VerifyFilter)}
          >
            <option value="all">All</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </label>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-footnote">
            <thead className="bg-fill text-caption font-semibold uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">User</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Verified</th>
                <th className="px-5 py-3 font-semibold">City</th>
                <th className="px-5 py-3 font-semibold">Joined</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-t border-separator">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-foreground">{user.name}</p>
                    <p className="text-muted">{user.email}</p>
                    {user.trade ? (
                      <p className="text-caption text-muted">{user.trade}</p>
                    ) : null}
                  </td>
                  <td className="px-5 py-3 capitalize">{user.role}</td>
                  <td className="px-5 py-3">
                    <Badge
                      className={
                        user.status === "banned"
                          ? "bg-danger/12 text-danger"
                          : "bg-success-soft text-success"
                      }
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    {user.role === "professional" ? (
                      <Badge
                        className={
                          user.verified
                            ? "bg-primary/12 text-primary"
                            : "bg-warning-soft text-warning"
                        }
                      >
                        {user.verified ? "Verified" : "Unverified"}
                      </Badge>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-label">{user.city}</td>
                  <td className="px-5 py-3 text-muted">{user.joined}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDialog({ type: "edit", user })}
                      >
                        Edit
                      </Button>
                      {user.role === "professional" && !user.verified ? (
                        <Button
                          size="sm"
                          onClick={() => setDialog({ type: "verify", user })}
                        >
                          Verify
                        </Button>
                      ) : null}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDialog({ type: "ban", user })}
                      >
                        {user.status === "banned" ? "Unban" : "Ban"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-danger/30 text-danger"
                        onClick={() => setDialog({ type: "delete", user })}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 ? (
          <p className="px-5 py-8 text-center text-footnote text-muted">
            No users match these filters.
          </p>
        ) : null}
      </Card>

      {dialog?.type === "edit" ? (
        <EditUserDialog
          user={dialog.user}
          onClose={() => setDialog(null)}
          onSave={(update) => {
            patch(dialog.user.id, update);
            setNotice(`Updated ${update.name ?? dialog.user.name}.`);
            setDialog(null);
          }}
        />
      ) : null}

      {dialog?.type === "ban" ? (
        <ConfirmDialog
          title={dialog.user.status === "banned" ? "Unban user?" : "Ban user?"}
          body={
            dialog.user.status === "banned"
              ? `${dialog.user.name} will be able to sign in again.`
              : `${dialog.user.name} will be blocked from signing in.`
          }
          confirmLabel={dialog.user.status === "banned" ? "Unban" : "Ban"}
          danger={dialog.user.status !== "banned"}
          onClose={() => setDialog(null)}
          onConfirm={() => {
            const next = dialog.user.status === "banned" ? "active" : "banned";
            patch(dialog.user.id, { status: next });
            setNotice(
              next === "banned"
                ? `Banned ${dialog.user.name}.`
                : `Unbanned ${dialog.user.name}.`,
            );
            setDialog(null);
          }}
        />
      ) : null}

      {dialog?.type === "verify" ? (
        <ConfirmDialog
          title="Verify professional?"
          body={`${dialog.user.name} will show as a verified professional.`}
          confirmLabel="Verify"
          onClose={() => setDialog(null)}
          onConfirm={() => {
            patch(dialog.user.id, { verified: true });
            setNotice(`Verified ${dialog.user.name}.`);
            setDialog(null);
          }}
        />
      ) : null}

      {dialog?.type === "delete" ? (
        <ConfirmDialog
          title="Delete account?"
          body={`Permanently remove ${dialog.user.name}. This cannot be undone.`}
          confirmLabel="Delete account"
          danger
          onClose={() => setDialog(null)}
          onConfirm={() => {
            setUsers((current) =>
              current.filter((user) => user.id !== dialog.user.id),
            );
            setNotice(`Deleted ${dialog.user.name}.`);
            setDialog(null);
          }}
        />
      ) : null}
    </div>
  );
}

function ConfirmDialog({
  title,
  body,
  confirmLabel,
  danger = false,
  onClose,
  onConfirm,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  danger?: boolean;
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
        aria-labelledby="user-dialog-title"
        className="w-full max-w-md rounded-2xl bg-background p-6 shadow-float"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="user-dialog-title" className="text-title font-bold">
          {title}
        </h2>
        <p className="mt-2 text-subhead text-muted">{body}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className={danger ? "bg-danger text-white active:opacity-90" : undefined}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

function EditUserDialog({
  user,
  onClose,
  onSave,
}: {
  user: ManagedUser;
  onClose: () => void;
  onSave: (update: Partial<ManagedUser>) => void;
}) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [city, setCity] = useState(user.city);
  const [trade, setTrade] = useState(user.trade ?? "");

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-user-title"
        className="w-full max-w-md rounded-2xl bg-background p-6 shadow-float"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="edit-user-title" className="text-title font-bold">
          Edit user
        </h2>
        <div className="mt-4 flex flex-col gap-3">
          <Field label="Full name">
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>
          <Field label="City">
            <Input value={city} onChange={(event) => setCity(event.target.value)} />
          </Field>
          {user.role === "professional" ? (
            <Field label="Trade">
              <Input
                value={trade}
                onChange={(event) => setTrade(event.target.value)}
              />
            </Field>
          ) : null}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              onSave({
                name: name.trim() || user.name,
                email: email.trim() || user.email,
                city: city.trim() || user.city,
                trade: user.role === "professional" ? trade.trim() : undefined,
              })
            }
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
