import { Badge, Card } from "@/components/ui";
import { customerBookings } from "@/lib/data/marketplace";

export default function AdminBookingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-large-title font-bold tracking-tight">Bookings</h1>
      {customerBookings.map((booking) => (
        <Card key={booking.id} className="flex items-center justify-between">
          <div>
            <p className="text-body font-semibold">
              {booking.customerName} → {booking.professionalName}
            </p>
            <p className="text-footnote text-muted">
              {booking.trade} · {booking.when}
            </p>
          </div>
          <Badge className="capitalize">{booking.status}</Badge>
        </Card>
      ))}
    </div>
  );
}
