import { CalendarDays, Clock, MapPin, Tag } from "lucide-react";
import { SPORTS, formatHour } from "@/lib/data";
import { useApp, type Booking } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { SportIcon } from "@/components/SportIcon";

export function BookingDetails({ booking }: { booking: Booking }) {
  const sport = SPORTS.find((item) => item.id === booking.sport);
  const isUpcoming = booking.status === "upcoming";

  return (
    <div className="text-left bg-white p-5 border border-[#e5e7eb] border-l-4 border-l-[#0d1b2a] shadow-xs">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#f1f3f6] pb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-[#f4f5f7] text-[#0d1b2a] border border-[#e5e7eb]">
              <SportIcon sport={booking.sport} className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-black text-base text-[#111827] uppercase tracking-tight break-words">
                {booking.courtName}
              </h3>
              <p className="text-[11px] font-bold text-[#e35925] uppercase tracking-wider">
                {sport?.name || booking.sport} · {booking.campus}
              </p>
            </div>
          </div>
        </div>

        <span
          className={`border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
            isUpcoming
              ? "bg-[#0d1b2a] text-white border-[#0d1b2a]"
              : "bg-[#f4f5f7] text-[#94a3b8] border-[#e5e7eb]"
          }`}
        >
          {isUpcoming ? "CONFIRMED PASS" : "CANCELLED"}
        </span>
      </div>

      <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-[#475569]">
        <p className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-[#0d1b2a] shrink-0" />
          <span className="font-medium">{booking.campus}</span>
        </p>
        <p className="flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 text-[#e35925] shrink-0" />
          <span className="font-medium">{booking.dateLabel}</span>
        </p>
        <p className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-[#0d1b2a] shrink-0" />
          <span className="font-bold text-[#111827]">
            {formatHour(booking.hour)} – {formatHour(booking.hour + 1)}
          </span>
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[#f4f5f7] flex flex-wrap items-center justify-between text-xs text-[#64748b]">
        <span className="font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5">
          <Tag className="h-3 w-3 text-[#e35925]" />
          REF: {booking.id.toUpperCase()}
        </span>
        <span className="font-black text-[#111827] uppercase tracking-wider">
          Student Rate: ₹{booking.price || 0}
        </span>
      </div>
    </div>
  );
}

export function MyBookings() {
  const { bookings, cancelBooking } = useApp();

  return (
    <section className="mt-10" aria-label="My Bookings">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#0d1b2a] pb-3 gap-2">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#e35925]">
            Athlete Schedule
          </span>
          <h2 className="text-xl font-black text-[#111827] uppercase tracking-tight">
            My Booked Passes & Sessions
          </h2>
        </div>
        <span className="bg-[#0d1b2a] text-white text-[10px] px-3 py-1 font-black uppercase tracking-wider self-start sm:self-auto">
          Total Passes: {bookings.length}
        </span>
      </div>

      {bookings.length === 0 ? (
        <div className="mt-4 p-10 text-center bg-white border border-[#e5e7eb] text-xs text-[#64748b] uppercase tracking-wider font-semibold">
          No facility bookings found for your student ID. Browse courts to book a slot.
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto border border-[#e5e7eb] bg-white shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#0d1b2a] text-white">
                <tr>
                  <th className="py-3 px-3.5 font-black uppercase tracking-wider border-r border-[#1e293b]">
                    #
                  </th>
                  <th className="py-3 px-3.5 font-black uppercase tracking-wider border-r border-[#1e293b]">
                    Pass Ref
                  </th>
                  <th className="py-3 px-3.5 font-black uppercase tracking-wider border-r border-[#1e293b]">
                    Sport / Arena
                  </th>
                  <th className="py-3 px-3.5 font-black uppercase tracking-wider border-r border-[#1e293b]">
                    Campus
                  </th>
                  <th className="py-3 px-3.5 font-black uppercase tracking-wider border-r border-[#1e293b]">
                    Date & Slot
                  </th>
                  <th className="py-3 px-3.5 font-black uppercase tracking-wider border-r border-[#1e293b]">
                    Status
                  </th>
                  <th className="py-3 px-3.5 font-black uppercase tracking-wider text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...bookings].reverse().map((booking, index) => {
                  const isUpcoming = booking.status === "upcoming";
                  return (
                    <tr
                      key={booking.id}
                      className="border-b border-[#f1f3f6] hover:bg-[#fafafc] transition-colors"
                    >
                      <td className="py-3 px-3.5 text-[#64748b] font-mono border-r border-[#f1f3f6]">
                        {index + 1}
                      </td>
                      <td className="py-3 px-3.5 font-mono font-bold text-[#111827] border-r border-[#f1f3f6]">
                        {booking.id.toUpperCase()}
                      </td>
                      <td className="py-3 px-3.5 font-bold text-[#111827] border-r border-[#f1f3f6]">
                        <div className="flex items-center gap-2">
                          <SportIcon sport={booking.sport} className="h-3.5 w-3.5 text-[#e35925]" />
                          <span className="uppercase tracking-tight">{booking.courtName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-[#475569] font-medium border-r border-[#f1f3f6]">
                        {booking.campus}
                      </td>
                      <td className="py-3 px-3.5 text-[#111827] font-semibold border-r border-[#f1f3f6]">
                        {booking.dateLabel} · {formatHour(booking.hour)}–
                        {formatHour(booking.hour + 1)}
                      </td>
                      <td className="py-3 px-3.5 border-r border-[#f1f3f6]">
                        <span
                          className={`inline-block border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                            isUpcoming
                              ? "bg-[#0d1b2a] text-white border-[#0d1b2a]"
                              : "bg-[#f4f5f7] text-[#94a3b8] border-[#e5e7eb]"
                          }`}
                        >
                          {isUpcoming ? "CONFIRMED" : "CANCELLED"}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        {isUpcoming ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-7 px-3 text-[10px] font-black tracking-wider uppercase"
                            onClick={() => cancelBooking(booking.id)}
                          >
                            Cancel
                          </Button>
                        ) : (
                          <span className="text-[10px] text-[#94a3b8] uppercase font-bold">
                            Void
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="grid gap-3.5 md:hidden">
            {[...bookings].reverse().map((booking) => (
              <article key={booking.id} className="border border-[#e5e7eb] bg-white p-4 shadow-xs">
                <BookingDetails booking={booking} />
                {booking.status === "upcoming" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3.5 w-full text-red-600 border-red-200 hover:bg-red-50 text-[10px] font-black uppercase tracking-wider"
                    onClick={() => cancelBooking(booking.id)}
                  >
                    Cancel Pass
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
