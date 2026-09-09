import { Tx } from "@/components/i18n/tx";
import { Card, ScreenHeader } from "@/components/ui";

export default function ProSchedulePage() {
  return (
    <div className="flex flex-col gap-4 px-5">
      <ScreenHeader
        eyebrow={<Tx k="schedule.eyebrow" />}
        title={<Tx k="schedule.title" />}
      />
      <Card>
        <p className="text-body font-semibold">Thu 11 · 10:00</p>
        <p className="text-footnote text-muted">
          <Tx k="schedule.sample" />
        </p>
      </Card>
    </div>
  );
}
