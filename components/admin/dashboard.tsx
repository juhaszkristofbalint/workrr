import { CreditAddWidget } from "@/components/admin/credit-add-widget";
import { BarChart, ChartLegend, LineChart } from "@/components/admin/charts";
import { Badge, Card } from "@/components/ui";
import {
  adminKpis,
  creditAddsByWeek,
  creditLedgerRows,
  creditsSoldByWeek,
  grantProfessionals,
  jobsActiveByWeek,
  jobsCompletedByWeek,
  recentJobs,
  recentRegistrations,
  registrationSeries,
  revenueByWeek,
  weekLabels,
} from "@/lib/data/admin-dashboard";
import { cn } from "@/lib/cn";

const statusTone: Record<string, string> = {
  Active: "bg-accent/15 text-primary",
  Completed: "bg-success-soft text-success",
  Customer: "bg-fill text-label",
  Professional: "bg-primary/12 text-primary",
  Stripe: "bg-success-soft text-success",
  "Admin add": "bg-warning-soft text-warning",
};

export function AdminDashboard() {
  const kpis = adminKpis.filter((item) => item.id !== "creditAdd");

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <div>
        <p className="text-footnote font-medium text-muted">Marketplace</p>
        <h1 className="text-large-title font-bold tracking-tight">
          Admin dashboard
        </h1>
        <p className="mt-1 text-subhead text-muted">Wednesday, 9 Sep 2026</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((stat) => (
          <Card key={stat.id}>
            <p className="text-footnote text-muted">{stat.label}</p>
            <p className="mt-2 text-title font-bold tabular-nums">{stat.value}</p>
            <p className="mt-1 text-caption text-muted">{stat.delta}</p>
          </Card>
        ))}
        <CreditAddWidget professionals={grantProfessionals} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-body font-semibold">New registrations</h2>
            <ChartLegend
              items={[
                { name: "Customers", color: "#2563EB" },
                { name: "Professionals", color: "#60A5FA" },
              ]}
            />
          </div>
          <BarChart
            labels={weekLabels}
            series={[
              {
                name: "Customers",
                color: "#2563EB",
                values: registrationSeries.customers,
              },
              {
                name: "Professionals",
                color: "#60A5FA",
                values: registrationSeries.professionals,
              },
            ]}
          />
        </Card>
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-body font-semibold">Revenue</h2>
            <ChartLegend items={[{ name: "Weekly revenue", color: "#059669" }]} />
          </div>
          <LineChart
            labels={weekLabels}
            series={[
              { name: "Revenue", color: "#059669", values: revenueByWeek },
            ]}
          />
        </Card>
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-body font-semibold">Credits sold vs add</h2>
            <ChartLegend
              items={[
                { name: "Sold (Stripe)", color: "#2563EB" },
                { name: "Admin add", color: "#D97706" },
              ]}
            />
          </div>
          <BarChart
            labels={weekLabels}
            series={[
              { name: "Sold", color: "#2563EB", values: creditsSoldByWeek },
              { name: "Admin add", color: "#D97706", values: creditAddsByWeek },
            ]}
          />
        </Card>
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-body font-semibold">Jobs</h2>
            <ChartLegend
              items={[
                { name: "Active", color: "#2563EB" },
                { name: "Completed", color: "#059669" },
              ]}
            />
          </div>
          <LineChart
            labels={weekLabels}
            series={[
              { name: "Active", color: "#2563EB", values: jobsActiveByWeek },
              {
                name: "Completed",
                color: "#059669",
                values: jobsCompletedByWeek,
              },
            ]}
          />
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <DataTable
          title="New registrations"
          headers={["Name", "Role", "City", "When"]}
          rows={recentRegistrations.map((row) => [
            row.name,
            <Badge key={row.id} className={statusTone[row.role]}>
              {row.role}
            </Badge>,
            row.city,
            row.when,
          ])}
        />
        <DataTable
          title="Jobs"
          headers={["Job", "Parties", "Status", "When"]}
          rows={recentJobs.map((row) => [
            row.title,
            row.party,
            <Badge key={row.id} className={statusTone[row.status]}>
              {row.status}
            </Badge>,
            row.when,
          ])}
        />
      </div>
      <DataTable
        title="Credits sold and admin add"
        headers={["Professional", "Type", "Credits", "When"]}
        rows={creditLedgerRows.map((row) => [
          row.who,
          <Badge key={row.id} className={statusTone[row.type]}>
            {row.type}
          </Badge>,
          `+${row.amount}`,
          row.when,
        ])}
      />
    </div>
  );
}

function DataTable({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="px-5 py-4">
        <h2 className="text-body font-semibold">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-footnote">
          <thead className="bg-fill text-caption font-semibold uppercase tracking-wide text-muted">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-5 py-2.5 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t border-separator">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={cn(
                      "px-5 py-3 text-label",
                      cellIndex === 0 && "font-semibold text-foreground",
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
