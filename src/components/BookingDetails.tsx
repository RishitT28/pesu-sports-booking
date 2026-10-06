import { CalendarDays, Clock, MapPin } from "lucide-react";
import { SPORTS, formatHour } from "@/lib/data";
import { useApp, type Booking } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function BookingDetails({ booking }: { booking: Booking }) {
  const sport = SPORTS.find((item) => item.id === booking.sport);
  return (
    <div className="text-left">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold break-words">{booking.courtName}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{sport?.icon} {sport?.name}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${booking.status === "upcoming" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
          {booking.status === "upcoming" ? "Confirmed" : "Cancelled"}
        </span>
      </div>
      <div className="mt-3 space-y-2 text-sm text-muted-foreground">
        <p className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" />{booking.campus}</p>
        <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 shrink-0" />{booking.dateLabel}</p>
        <p className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0" />{formatHour(booking.hour)} – {formatHour(booking.hour + 1)} · 1 hour</p>
      </div>
      <p className="mt-3 break-all font-mono text-xs text-muted-foreground">Booking ID: {booking.id.toUpperCase()}</p>
    </div>
  );
}

export function MyBookings() {
  const { bookings, cancelBooking } = useApp();
  return (
    <section className="mt-7" aria-label="My Bookings">
      <h2 className="text-lg font-bold">My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="mt-3 py-5 text-sm text-muted-foreground">No bookings yet.</p>
      ) : (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {[...bookings].reverse().map((booking) => (
            <article key={booking.id} className="rounded-2xl border border-border bg-card p-4">
              <BookingDetails booking={booking} />
              {booking.status === "upcoming" && (
                <Button variant="outline" size="sm" className="mt-4" onClick={() => cancelBooking(booking.id)}>Cancel booking</Button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}