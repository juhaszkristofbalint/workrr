"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WorkRRLogo } from "@/components/logo";
import { cn } from "@/lib/cn";
import { signOutAction } from "@/lib/auth/actions";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/bookings", label: "Bookings" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-separator bg-card px-4 py-6">
      <div className="flex items-center gap-3 px-2">
        <WorkRRLogo className="h-10 w-10" />
        <div>
          <p className="text-subhead font-semibold">WorkRR</p>
          <p className="text-caption text-muted">Admin</p>
        </div>
      </div>
      <nav className="mt-8 flex flex-col gap-1" aria-label="Admin">
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2.5 text-subhead font-medium",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-label hover:bg-fill",
              )}
              aria-current={active ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <form action={signOutAction} className="mt-auto px-2">
        <button
          type="submit"
          className="text-footnote font-semibold text-muted hover:text-foreground"
        >
          Sign out
        </button>
      </form>
    </aside>
  );
}
