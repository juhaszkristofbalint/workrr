import { Tx } from "@/components/i18n/tx";
import { Card, ScreenHeader } from "@/components/ui";

export default function CustomerMessagesPage() {
  return (
    <div className="flex flex-col gap-4 px-5">
      <ScreenHeader
        eyebrow={<Tx k="messages.eyebrow" />}
        title={<Tx k="messages.title" />}
      />
      <Card>
        <p className="text-body font-semibold">Maya Chen</p>
        <p className="text-footnote text-muted">
          <Tx k="messages.customerPreview" />
        </p>
      </Card>
    </div>
  );
}
