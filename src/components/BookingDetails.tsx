import { CalendarDays, Clock, MapPin, Tag } from "lucide-react";
import { SPORTS, formatHour } from "@/lib/data";
import { useApp, type Booking } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { SportIcon } from "@/components/SportIcon";

export function BookingDetails({ booking }: { booking: Booking }) {
  const sport = SPORTS.find((item) => item.id === booking.sport);
  const isUpcoming = booking.status === "upcoming";

  return (
    <div className="text-left bg-white p-4 border border-[#dbe2ea] rounded-none">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#e2e8f0] pb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#f0f3f6] text-[#0b5788] border border-[#dbe2ea]">
              <SportIcon sport={booking.sport} className="h-4 w-4" />
            </span>
            <h3 className="font-semibold text-base text-[#1e293b] break-words">
              {booking.courtName}
            </h3>
          </div>
          <p className="mt-1 text-xs text-[#64748b] font-medium">{sport?.name || booking.sport}</p>
        </div>
        <span
          className={`rounded-none border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
            isUpcoming
              ? "bg-[#e6f4ea] text-[#137333] border-[#ceead6]"
              : "bg-[#fce8e6] text-[#c5221f] border-[#fad2cf]"
          }`}
        >
          {isUpcoming ? "Confirmed" : "Cancelled"}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#475569]">
        <p className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-[#0b5788] shrink-0" />
          <span>{booking.campus}</span>
        </p>
        <p className="flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5 text-[#0b5788] shrink-0" />
          <span>{booking.dateLabel}</span>
        </p>
        <p className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-[#0b5788] shrink-0" />
          <span>
            {formatHour(booking.hour)} – {formatHour(booking.hour + 1)}
          </span>
        </p>
      </div>

      <div className="mt-3 pt-2.5 border-t border-[#f1f5f9] flex flex-wrap items-center justify-between text-xs text-[#64748b]">
        <span className="font-mono text-[11px] uppercase tracking-wider flex items-center gap-1">
          <Tag className="h-3 w-3 text-[#94a3b8]" />
          Ref: {booking.id.toUpperCase()}
        </span>
        <span className="font-semibold text-[#0f172a]">Amount: ₹{booking.price || 0}</span>
      </div>
    </div>
  );
}

export function MyBookings() {
  const { bookings, cancelBooking } = useApp();

  return (
    <section className="mt-7" aria-label="My Bookings">
      <div className="flex items-center justify-between border-b border-[#cbd5e1] pb-2.5">
        <div>
          <h2 className="text-lg font-bold text-[#0f172a] uppercase tracking-wide">
            My Sports Bookings
          </h2>
          <p className="text-xs text-[#64748b]">
            Real-time PESU campus court reservations and status
          </p>
        </div>
        <span className="bg-[#0b5788] text-white text-xs px-2.5 py-1 font-semibold rounded-none">
          Total: {bookings.length}
        </span>
      </div>

      {bookings.length === 0 ? (
        <div className="mt-3 p-8 text-center bg-white border border-[#dbe2ea] text-sm text-[#64748b] rounded-none">
          No sports facility bookings found for your account.
        </div>
      ) : (
        <div className="mt-4">
          {/* Desktop Table View (PESU Academy signature style) */}
          <div className="hidden md:block overflow-x-auto border border-[#cbd5e1] bg-white rounded-none">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#0b5788] text-white">
                <tr>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider border-r border-[#08456c]">
                    Sl.No
                  </th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider border-r border-[#08456c]">
                    Booking Ref
                  </th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider border-r border-[#08456c]">
                    Sport / Court
                  </th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider border-r border-[#08456c]">
                    Campus
                  </th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider border-r border-[#08456c]">
                    Date & Slot
                  </th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider border-r border-[#08456c]">
                    Status
                  </th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...bookings].reverse().map((booking, index) => {
                  const isUpcoming = booking.status === "upcoming";
                  return (
                    <tr
                      key={booking.id}
                      className="border-b border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors"
                    >
                      <td className="py-2.5 px-3 text-[#64748b] border-r border-[#e2e8f0]">
                        {index + 1}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium text-[#0f172a] border-r border-[#e2e8f0]">
                        {booking.id.toUpperCase()}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-[#0f172a] border-r border-[#e2e8f0]">
                        <div className="flex items-center gap-1.5">
                          <SportIcon sport={booking.sport} className="h-3.5 w-3.5 text-[#0b5788]" />
                          <span>{booking.courtName}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-[#475569] border-r border-[#e2e8f0]">
                        {booking.campus}
                      </td>
                      <td className="py-2.5 px-3 text-[#475569] border-r border-[#e2e8f0]">
                        {booking.dateLabel} · {formatHour(booking.hour)}–
                        {formatHour(booking.hour + 1)}
                      </td>
                      <td className="py-2.5 px-3 border-r border-[#e2e8f0]">
                        <span
                          className={`inline-block border px-2 py-0.5 text-[10px] font-bold uppercase rounded-none ${
                            isUpcoming
                              ? "bg-[#e6f4ea] text-[#137333] border-[#ceead6]"
                              : "bg-[#fce8e6] text-[#c5221f] border-[#fad2cf]"
                          }`}
                        >
                          {isUpcoming ? "Confirmed" : "Cancelled"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {isUpcoming ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="rounded-none h-7 px-2.5 text-xs font-medium"
                            onClick={() => cancelBooking(booking.id)}
                          >
                            Cancel
                          </Button>
                        ) : (
                          <span className="text-[11px] text-[#94a3b8] italic">Void</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="grid gap-3 md:hidden">
            {[...bookings].reverse().map((booking) => (
              <article
                key={booking.id}
                className="border border-[#cbd5e1] bg-white p-3.5 rounded-none shadow-xs"
              >
                <BookingDetails booking={booking} />
                {booking.status === "upcoming" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full rounded-none text-red-600 border-red-200 hover:bg-red-50 text-xs font-semibold"
                    onClick={() => cancelBooking(booking.id)}
                  >
                    Cancel Booking
                  </Button>
                )}
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
