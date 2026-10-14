import { CalendarDays, Clock, MapPin, Tag, Users, AlertCircle } from "lucide-react";
import { SPORTS, formatHour } from "@/lib/data";
import { useApp, type Booking, type QueueRequest } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { SportIcon } from "@/components/SportIcon";

export function BookingDetails({ booking }: { booking: Booking }) {
  const { college } = useApp();
  const sport = SPORTS.find((item) => item.id === booking.sport);
  const isUpcoming = booking.status === "upcoming";

  return (
    <div
      className={`text-left bg-white p-6 border shadow-xs font-serif ${college.buttonStyle.radiusClass}`}
      style={{
        borderColor: college.colors.border,
        borderLeftWidth: "4px",
        borderLeftColor: college.colors.primary,
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#eeeae1] pb-3.5">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className={`p-2 bg-[#f5f4ef] text-[#1a2639] border border-[#ded9cd] ${college.buttonStyle.radiusClass}`}>
              <SportIcon sport={booking.sport} className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-bold text-base text-[#1a2639] break-words">
                {booking.courtName}
              </h3>
              <p className="text-xs font-medium mt-0.5" style={{ color: college.colors.accent || college.colors.primary }}>
                {sport?.name || booking.sport} · {booking.campus}
              </p>
            </div>
          </div>
        </div>

        <span
          className={`border px-2.5 py-1 text-xs font-medium ${college.buttonStyle.radiusClass} ${
            isUpcoming
              ? "text-white"
              : "bg-[#f5f4ef] text-[#636a77] border-[#ded9cd]"
          }`}
          style={isUpcoming ? { backgroundColor: college.colors.primary, borderColor: college.colors.primary } : undefined}
        >
          {isUpcoming ? "Confirmed Reservation" : "Cancelled"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#4b5260]">
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0" style={{ color: college.colors.primary }} />
          <span>{booking.campus}</span>
        </p>
        <p className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 shrink-0" style={{ color: college.colors.accent || college.colors.primary }} />
          <span>{booking.dateLabel}</span>
        </p>
        <p className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#1a2639] shrink-0" />
          <span className="font-semibold text-[#1a2639]">
            {formatHour(booking.hour)} – {formatHour(booking.hour + 1)}
          </span>
        </p>
      </div>

      <div className="mt-4 pt-3.5 border-t border-[#eeeae1] flex flex-wrap items-center justify-between text-xs text-[#636a77]">
        <span className="font-mono text-xs flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5" style={{ color: college.colors.accent || college.colors.primary }} />
          Ref: {booking.id}
        </span>
        <span className="font-semibold text-[#1a2639]">
          Facility Access: Free ({college.shortName} Student Pass)
        </span>
      </div>

      <div className="mt-2.5 text-[11px] text-[#636a77] flex items-center gap-1.5 border-t border-[#eeeae1] pt-2">
        <span className="text-[#10b981] font-bold">●</span>
        <span>Active clearance verified · Turnstile scan synchronized with {college.studentIdLabel}</span>
      </div>
    </div>
  );
}

export function MyBookings() {
  const { bookings, cancelBooking, queueRequests, cancelQueueRequest, college } = useApp();
  const activeQueues = queueRequests.filter((q) => q.status === "waiting");

  return (
    <section className="mt-12 space-y-8 font-serif" aria-label="My Bookings">
      {/* 1. Confirmed Reservations Table */}
      <div>
        <div
          className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-3 gap-2 border-b-2"
          style={{ borderBottomColor: college.colors.primary }}
        >
          <div>
            <span
              className="text-xs font-semibold"
              style={{ color: college.colors.accent || college.colors.primary }}
            >
              Student Schedule
            </span>
            <h2 className="text-xl font-bold" style={{ color: college.colors.primary }}>
              My Booked Passes & Sessions
            </h2>
          </div>
          <span
            className={`text-white text-xs px-3 py-1 font-medium self-start sm:self-auto ${college.buttonStyle.radiusClass}`}
            style={{ backgroundColor: college.colors.primary }}
          >
            Total Passes: {bookings.length}
          </span>
        </div>

        {bookings.length === 0 ? (
          <div className={`mt-4 p-8 text-center bg-white border border-[#ded9cd] text-xs text-[#636a77] ${college.buttonStyle.radiusClass}`}>
            No facility bookings found for your student ID. Browse courts to book a slot.
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {/* Desktop Table View */}
            <div className={`hidden md:block overflow-x-auto border border-[#ded9cd] bg-white shadow-xs ${college.buttonStyle.radiusClass}`}>
              <table className="w-full text-left border-collapse text-xs">
                <thead className="text-white" style={{ backgroundColor: college.colors.primary }}>
                  <tr>
                    <th className="py-3 px-4 font-semibold border-r border-white/20">#</th>
                    <th className="py-3 px-4 font-semibold border-r border-white/20">Pass Ref</th>
                    <th className="py-3 px-4 font-semibold border-r border-white/20">
                      Facility & Sport
                    </th>
                    <th className="py-3 px-4 font-semibold border-r border-white/20">Campus</th>
                    <th className="py-3 px-4 font-semibold border-r border-white/20">
                      Date & Slot
                    </th>
                    <th className="py-3 px-4 font-semibold border-r border-white/20">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[...bookings].reverse().map((booking, index) => {
                    const isUpcoming = booking.status === "upcoming";
                    return (
                      <tr
                        key={booking.id}
                        className="border-b border-[#eeeae1] hover:bg-[#faf9f5] transition-colors"
                      >
                        <td className="py-3.5 px-4 text-[#636a77] font-mono border-r border-[#eeeae1]">
                          {index + 1}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-medium text-[#1a2639] border-r border-[#eeeae1]">
                          {booking.id}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#1a2639] border-r border-[#eeeae1]">
                          <div className="flex items-center gap-2">
                            <SportIcon
                              sport={booking.sport}
                              className="h-3.5 w-3.5"
                              style={{ color: college.colors.accent || college.colors.primary }}
                            />
                            <span>{booking.courtName}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[#4b5260] border-r border-[#eeeae1]">
                          {booking.campus}
                        </td>
                        <td className="py-3.5 px-4 text-[#1a2639] font-medium border-r border-[#eeeae1]">
                          {booking.dateLabel} · {formatHour(booking.hour)}–
                          {formatHour(booking.hour + 1)}
                        </td>
                        <td className="py-3.5 px-4 border-r border-[#eeeae1]">
                          <span
                            className={`inline-block border px-2 py-0.5 text-[11px] font-medium ${college.buttonStyle.radiusClass} ${
                              isUpcoming
                                ? "text-white"
                                : "bg-[#f5f4ef] text-[#636a77] border-[#ded9cd]"
                            }`}
                            style={isUpcoming ? { backgroundColor: college.colors.primary, borderColor: college.colors.primary } : undefined}
                          >
                            {isUpcoming ? "Confirmed" : "Cancelled"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {isUpcoming ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              className={`h-7 px-3 text-xs ${college.buttonStyle.radiusClass}`}
                              onClick={() => cancelBooking(booking.id)}
                            >
                              Cancel Pass
                            </Button>
                          ) : (
                            <span className="text-xs text-[#8c94a0]">Released</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="grid gap-4 md:hidden">
              {[...bookings].reverse().map((booking) => (
                <article
                  key={booking.id}
                  className={`border border-[#ded9cd] bg-white p-4 shadow-xs ${college.buttonStyle.radiusClass}`}
                >
                  <BookingDetails booking={booking} />
                  {booking.status === "upcoming" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className={`mt-3 w-full text-[#b94236] border-[#ded9cd] hover:bg-[#fdf2f1] text-xs ${college.buttonStyle.radiusClass}`}
                      onClick={() => cancelBooking(booking.id)}
                    >
                      Cancel Reservation
                    </Button>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Standby Queue Requests (Starvation-Protected Waitlist) */}
      <div className="pt-4">
        <div
          className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-3 gap-2 border-b-2"
          style={{ borderBottomColor: college.colors.primary }}
        >
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-semibold"
                style={{ color: college.colors.accent || college.colors.primary }}
              >
                Standby Waitlist
              </span>
              <span className={`text-[11px] bg-[#fdf3ee] border border-[#f5dbcf] px-2 py-0.5 ${college.buttonStyle.radiusClass}`} style={{ color: college.colors.primary }}>
                Max 2 queue spots per slot
              </span>
            </div>
            <h2 className="text-xl font-bold mt-0.5" style={{ color: college.colors.primary }}>Active Queue Requests</h2>
          </div>
          <span
            className={`text-white text-xs px-3 py-1 font-medium self-start sm:self-auto ${college.buttonStyle.radiusClass}`}
            style={{ backgroundColor: college.colors.primary }}
          >
            In Queue: {activeQueues.length}
          </span>
        </div>

        {activeQueues.length === 0 ? (
          <div className={`mt-4 p-6 text-center bg-white border border-[#ded9cd] text-xs text-[#636a77] ${college.buttonStyle.radiusClass}`}>
            You have no active standby queue requests. When a slot is booked, you can join the queue
            to be filled in if a cancellation happens.
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeQueues.map((q) => (
              <div
                key={q.id}
                className={`bg-white border p-5 shadow-xs flex flex-col justify-between ${college.buttonStyle.radiusClass}`}
                style={{
                  borderColor: college.colors.border,
                  borderLeftWidth: "4px",
                  borderLeftColor: college.colors.primary,
                }}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-[#eeeae1] pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`p-1.5 bg-[#f5f4ef] text-[#1a2639] border border-[#ded9cd] ${college.buttonStyle.radiusClass}`}>
                        <SportIcon sport={q.sport} className="h-4 w-4" />
                      </span>
                      <div>
                        <h4 className="font-bold text-sm" style={{ color: college.colors.primary }}>{q.courtName}</h4>
                        <p className="text-xs text-[#636a77]">{q.campus}</p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 text-xs font-semibold border ${college.buttonStyle.radiusClass}`}
                      style={{
                        backgroundColor: "#fdf3ee",
                        color: college.colors.primary,
                        borderColor: college.colors.border,
                      }}
                    >
                      Queue Position #{q.position} of 2
                    </span>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-[#4b5260]">
                    <p className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" style={{ color: college.colors.accent || college.colors.primary }} />
                      <span>
                        {q.dateLabel} · {formatHour(q.hour)}–{formatHour(q.hour + 1)}
                      </span>
                    </p>
                    <p className="flex items-center gap-1.5 text-[#636a77]">
                      <AlertCircle className="h-3.5 w-3.5 text-[#10b981]" />
                      <span>
                        Automatic promotion & schedule update if current player cancels
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#eeeae1] flex items-center justify-between">
                  <span className="text-[11px] text-[#8c94a0]">Requested {q.createdAt}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`text-xs text-[#b94236] border-[#ded9cd] hover:bg-[#fdf2f1] ${college.buttonStyle.radiusClass}`}
                    onClick={() => cancelQueueRequest(q.id)}
                  >
                    Withdraw from Queue
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
