import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
  QrCode,
  Send,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "BookQuick — Help, Guidelines & Directorate Contacts" },
      {
        name: "description",
        content:
          "Official help guide, court booking rules, standby queue policy, and Physical Education Directorate contact desk.",
      },
      { property: "og:title", content: "BookQuick — Help, Guidelines & Directorate Contacts" },
      {
        property: "og:description",
        content:
          "Official help guide, court booking rules, standby queue policy, and Physical Education Directorate contact desk.",
      },
    ],
  }),
  component: HelpPage,
});

const FAQS = [
  {
    q: "How does the standby queue request work for booked slots?",
    a: "When a facility slot is already reserved, you can place a Standby Queue Request. To prevent slot starvation and hoarding, each slot is capped at maximum 2 queue positions. If the current reservation is cancelled by the student or athletics desk, the system automatically promotes Position #1 to a confirmed reservation and updates your schedule immediately.",
  },
  {
    q: "Do I need to pay for court bookings?",
    a: "No. All sports facilities, courts, and lounges are fully funded by the university for enrolled students. Valid athletic registration and active student clearance are the only requirements.",
  },
  {
    q: "How do I access the turnstile gates at the Sports Complex?",
    a: "You can tap your physical student ID card at any turnstile gate, or scan the digital RFID Turnstile QR Pass available on your Student Profile page. Gate scanners synchronize automatically with confirmed reservations.",
  },
  {
    q: "What footwear and equipment are required?",
    a: "Non-marking gum-sole shoes are mandatory on synthetic wooden courts (Badminton Courts 1 & 2, Squash Courts). Box turf requires turf studs or sports sneakers (metal cleats are prohibited). Equipment like standard nets and floodlights are provided; please bring personal racquets, shuttles, or balls.",
  },
  {
    q: "Can I cancel a reservation if my schedule changes?",
    a: "Yes. Go to 'My Activity' and click 'Cancel Pass' on your upcoming reservation. Please cancel at least 30 minutes in advance so students on the standby queue can be filled in.",
  },
  {
    q: "Will I receive notifications for my bookings and waitlist promotions?",
    a: "Yes. The sports system automatically records your booking confirmations and updates your standby queue status in real time whenever a waitlisted court slot clears up and your spot is confirmed.",
  },
  {
    q: "How do open matches and squad finder work?",
    a: "Any verified student can post a practice run or 3v3 / doubles squad. Other students can join until the roster limit is reached. An integrated coordination chat allows squads to align on warmup times and gear.",
  },
];

function HelpPage() {
  const { college } = useApp();
  const [inquiryName, setInquiryName] = useState("");
  const [inquirySrn, setInquirySrn] = useState("");
  const [inquiryCategory, setInquiryCategory] = useState("Turnstile Gate Access");
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryMsg.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setInquiryMsg("");
      setSubmitted(false);
    }, 4000);
  };

  return (
    <main className="p-4 sm:p-8 space-y-10 max-w-7xl mx-auto font-serif">
      {/* 1. Header with Calm Dull Navy & Warm Orange Accent */}
      <div
        className={`bg-white border p-6 sm:p-8 shadow-xs ${college.buttonStyle.radiusClass}`}
        style={{
          borderColor: college.colors.border,
          borderLeftWidth: "4px",
          borderLeftColor: college.colors.primary,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#eeeae1] pb-4">
          <div>
            <span
              className="text-xs font-semibold"
              style={{ color: college.colors.accent || college.colors.primary }}
            >
              {college.shortName} Student Support Services
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold mt-0.5" style={{ color: college.colors.primary }}>
              Help Center & Directorate Contacts
            </h1>
            <p className="text-xs text-[#636a77] mt-1.5 leading-relaxed max-w-2xl">
              Facility guidelines, {college.studentIdLabel} turnstile rules, waitlist policies, and official Department
              of Physical Education contact channels at {college.name}.
            </p>
          </div>

          <div
            className={`flex items-center gap-2 bg-[#f5f4ef] px-3.5 py-1.5 border border-[#ded9cd] text-xs self-start sm:self-auto font-medium ${college.buttonStyle.radiusClass}`}
            style={{ color: college.colors.primary }}
          >
            <ShieldCheck className="h-4 w-4 text-[#10b981]" />
            <span>Athletics Desk Support Active</span>
          </div>
        </div>

        {/* Quick Help Navigation Anchors */}
        <div className="mt-5 flex flex-wrap gap-2 pt-1 text-xs">
          <a
            href="#contacts"
            className={`px-3 py-1.5 bg-[#f5f4ef] border border-[#ded9cd] text-[#1a2639] hover:bg-white transition-colors font-medium ${college.buttonStyle.radiusClass}`}
          >
            Directorate Contact Desk
          </a>
          <a
            href="#faqs"
            className={`px-3 py-1.5 bg-[#f5f4ef] border border-[#ded9cd] text-[#1a2639] hover:bg-white transition-colors font-medium ${college.buttonStyle.radiusClass}`}
          >
            Frequently Asked Questions
          </a>
          <a
            href="#report"
            className={`px-3 py-1.5 bg-[#f5f4ef] border border-[#ded9cd] text-[#1a2639] hover:bg-white transition-colors font-medium ${college.buttonStyle.radiusClass}`}
          >
            Report an Issue / Ticket
          </a>
        </div>
      </div>

      {/* 2. IN CASE OF ANY PROBLEM: CONTACT SECTION */}
      <section id="contacts" className="space-y-5">
        <div
          className="pb-3 border-b-2"
          style={{ borderBottomColor: college.colors.primary }}
        >
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-semibold"
              style={{ color: college.colors.accent || college.colors.primary }}
            >
              Immediate Support
            </span>
            <span
              className="text-[11px] px-2 py-0.2 border"
              style={{
                backgroundColor: "#fdf3ee",
                color: college.colors.primary,
                borderColor: college.colors.border,
              }}
            >
              Physical Education Directorate
            </span>
          </div>
          <h2 className="text-2xl font-bold mt-0.5" style={{ color: college.colors.primary }}>
            In Case of Any Problem: Contact
          </h2>
          <p className="text-xs text-[#636a77] mt-1">
            If you encounter gate entry discrepancies, equipment faults, or scheduling conflicts,
            reach out to the on-duty sports desk at {college.name}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {college.campuses.map((cName, idx) => (
            <div
              key={cName}
              className={`bg-white border p-6 shadow-xs space-y-3 ${college.buttonStyle.radiusClass}`}
              style={{
                borderColor: college.colors.border,
                borderLeftWidth: "4px",
                borderLeftColor: college.colors.primary,
              }}
            >
              <div className="flex items-center gap-2.5">
                <span className={`p-2 bg-[#f5f4ef] text-[#1a2639] border border-[#ded9cd] ${college.buttonStyle.radiusClass}`}>
                  <Building2 className="h-4 w-4" style={{ color: college.colors.primary }} />
                </span>
                <div>
                  <h3 className="font-bold text-sm" style={{ color: college.colors.primary }}>{cName} Sports Desk</h3>
                  <p className="text-xs text-[#636a77]">{college.shortName} Campus Desk</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#4b5260] pt-2 border-t border-[#eeeae1]">
                <p className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: college.colors.accent || college.colors.primary }} />
                  <span>Sports Complex & Arena Wing</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[#1a2639] shrink-0" />
                  <span>Direct: +91 (080) 2672 198{idx}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-[#1a2639] shrink-0" />
                  <span>Duty Desk: 06:00 to 22:00 Daily</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 shrink-0" style={{ color: college.colors.accent || college.colors.primary }} />
                  <span className="text-[#1a2639]">sportsdesk@{college.id}.edu</span>
                </p>
              </div>
            </div>
          ))}

          {/* Emergency & Turnstile Assistance */}
          <div
            className={`bg-white border p-6 shadow-xs space-y-3 ${college.buttonStyle.radiusClass}`}
            style={{
              borderColor: college.colors.border,
              borderLeftWidth: "4px",
              borderLeftColor: college.colors.accent || college.colors.primary,
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className={`p-2 bg-[#fdf3ee] border border-[#f5dbcf] ${college.buttonStyle.radiusClass}`}>
                <ShieldAlert className="h-4 w-4" style={{ color: college.colors.accent || college.colors.primary }} />
              </span>
              <div>
                <h3 className="font-bold text-sm" style={{ color: college.colors.primary }}>Turnstile Emergency Helpline</h3>
                <p className="text-xs text-[#636a77]">Gate Scan & Clearance Issues</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#4b5260] pt-2 border-t border-[#eeeae1]">
              <p className="leading-relaxed">
                If your {college.studentIdLabel} card does not unlock the gate scanner, verify that your sports
                clearance shows <strong>Active</strong> in your profile.
              </p>
              <p className="flex items-center gap-2 font-medium" style={{ color: college.colors.primary }}>
                <Phone className="h-3.5 w-3.5" style={{ color: college.colors.accent || college.colors.primary }} />
                <span>Gate Control Desk: +91 99000 12345</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#1a2639]" />
                <span className="text-[#1a2639]">facilities@{college.id}.edu</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FREQUENTLY ASKED QUESTIONS */}
      <section id="faqs" className="space-y-5">
        <div
          className="pb-3 border-b-2"
          style={{ borderBottomColor: college.colors.primary }}
        >
          <span
            className="text-xs font-semibold"
            style={{ color: college.colors.accent || college.colors.primary }}
          >
            Help Guidelines
          </span>
          <h2 className="text-2xl font-bold mt-0.5" style={{ color: college.colors.primary }}>Frequently Asked Questions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FAQS.map((item, i) => (
            <div
              key={i}
              className={`bg-white border p-6 shadow-xs space-y-2 ${college.buttonStyle.radiusClass}`}
              style={{ borderColor: college.colors.border }}
            >
              <div className="flex items-start gap-2.5">
                <HelpCircle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: college.colors.accent || college.colors.primary }} />
                <h3 className="font-bold text-sm" style={{ color: college.colors.primary }}>{item.q}</h3>
              </div>
              <p className="text-xs text-[#4b5260] leading-relaxed pl-6.5">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TICKET / ISSUE REPORT FORM */}
      <section id="report" className="space-y-5">
        <div
          className="pb-3 border-b-2"
          style={{ borderBottomColor: college.colors.primary }}
        >
          <span
            className="text-xs font-semibold"
            style={{ color: college.colors.accent || college.colors.primary }}
          >
            Direct Resolution
          </span>
          <h2 className="text-2xl font-bold mt-0.5" style={{ color: college.colors.primary }}>
            Submit an Inquiry or Report a Problem
          </h2>
        </div>

        <div
          className={`bg-white border p-6 sm:p-8 shadow-xs max-w-3xl ${college.buttonStyle.radiusClass}`}
          style={{ borderColor: college.colors.border }}
        >
          {submitted ? (
            <div className={`p-6 bg-[#f0fdf4] border border-[#bbf7d0] text-center space-y-2 ${college.buttonStyle.radiusClass}`}>
              <CheckCircle2 className="h-8 w-8 text-[#166534] mx-auto" />
              <h3 className="font-bold text-sm text-[#166534]">Inquiry Successfully Logged!</h3>
              <p className="text-xs text-[#4b5260]">
                A support ticket has been forwarded to the Department of Physical Education desk at {college.shortName}.
                You will receive an alert once resolved.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4b5260] mb-1">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Student Name"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className={`w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none text-[#1a2639] ${college.buttonStyle.radiusClass}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4b5260] mb-1">
                    Student {college.studentIdLabel}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={`e.g. ${college.studentIdPlaceholder}`}
                    value={inquirySrn}
                    onChange={(e) => setInquirySrn(e.target.value)}
                    className={`w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none text-[#1a2639] ${college.buttonStyle.radiusClass}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4b5260] mb-1">
                  Issue Category
                </label>
                <select
                  value={inquiryCategory}
                  onChange={(e) => setInquiryCategory(e.target.value)}
                  className={`w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none text-[#1a2639] ${college.buttonStyle.radiusClass}`}
                >
                  <option value="Turnstile Gate Access">
                    Turnstile Gate Access / RFID Card Issue
                  </option>
                  <option value="Court Booking Schedule">
                    Court Booking / Calendar Schedule Conflict
                  </option>
                  <option value="Standby Queue Issue">Standby Queue / Waitlist Inquiry</option>
                  <option value="Equipment / Facility Maintenance">
                    Equipment / Facility Maintenance Request
                  </option>
                  <option value="Inter-Campus Tournament">
                    Inter-Campus Tournament Participation
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4b5260] mb-1">
                  Description of Issue
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your issue or question in detail..."
                  value={inquiryMsg}
                  onChange={(e) => setInquiryMsg(e.target.value)}
                  className={`w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none text-[#1a2639] ${college.buttonStyle.radiusClass}`}
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  className={`text-white text-xs font-bold px-6 py-2 flex items-center gap-2 transition-all ${college.buttonStyle.radiusClass} ${college.buttonStyle.primaryClass} ${college.buttonStyle.extraClass}`}
                  style={{ backgroundColor: college.colors.primary }}
                >
                  <Send className="h-4 w-4" /> Submit to Sports Desk
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
