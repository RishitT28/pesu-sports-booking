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

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "PESU Sports — Help, Guidelines & Directorate Contacts" },
      {
        name: "description",
        content:
          "Official help guide, court booking rules, standby queue policy, and Physical Education Directorate contact desk.",
      },
      { property: "og:title", content: "PESU Sports — Help, Guidelines & Directorate Contacts" },
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
    a: "When a facility slot is already reserved, you can place a Standby Queue Request. To prevent slot starvation and hoarding, each slot is capped at maximum 2 queue positions. If the current reservation is cancelled by the student or athletics desk, the system automatically promotes Position #1 to a confirmed reservation and sends an instant alert.",
  },
  {
    q: "Do I need to pay for court bookings?",
    a: "No. All sports facilities, courts, and lounges are fully funded by PES University for enrolled students. Valid athletic registration and active student clearance are the only requirements.",
  },
  {
    q: "How do I access the turnstile gates at the Sports Complex?",
    a: "You can tap your physical PESU Student RFID card at any turnstile gate, or scan the digital RFID Turnstile QR Pass available on your Student Profile page. Gate scanners synchronize automatically with confirmed reservations.",
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
    q: "How do open matches and squad finder work?",
    a: "Any verified student can post a practice run or 3v3 / doubles squad. Other students can join until the roster limit is reached. An integrated coordination chat allows squads to align on warmup times and gear.",
  },
];

function HelpPage() {
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
      <div className="bg-white border border-[#ded9cd] border-l-4 border-l-[#1a2639] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#eeeae1] pb-4">
          <div>
            <span className="text-xs font-semibold text-[#c45524]">Student Support Services</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a2639] mt-0.5">
              Help Center & Directorate Contacts
            </h1>
            <p className="text-xs text-[#636a77] mt-1.5 leading-relaxed max-w-2xl">
              Facility guidelines, RFID turnstile rules, waitlist policies, and official Department
              of Physical Education contact channels.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#f5f4ef] px-3.5 py-1.5 border border-[#ded9cd] text-xs text-[#1a2639] self-start sm:self-auto font-medium">
            <ShieldCheck className="h-4 w-4 text-[#10b981]" />
            <span>Athletics Desk Support Active</span>
          </div>
        </div>

        {/* Quick Help Navigation Anchors */}
        <div className="mt-5 flex flex-wrap gap-2 pt-1 text-xs">
          <a
            href="#contacts"
            className="px-3 py-1.5 bg-[#f5f4ef] border border-[#ded9cd] text-[#1a2639] hover:bg-white transition-colors font-medium"
          >
            Directorate Contact Desk
          </a>
          <a
            href="#faqs"
            className="px-3 py-1.5 bg-[#f5f4ef] border border-[#ded9cd] text-[#1a2639] hover:bg-white transition-colors font-medium"
          >
            Frequently Asked Questions
          </a>
          <a
            href="#report"
            className="px-3 py-1.5 bg-[#f5f4ef] border border-[#ded9cd] text-[#1a2639] hover:bg-white transition-colors font-medium"
          >
            Report an Issue / Ticket
          </a>
        </div>
      </div>

      {/* 2. IN CASE OF ANY PROBLEM: CONTACT SECTION */}
      <section id="contacts" className="space-y-5">
        <div className="border-b-2 border-[#c45524] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#c45524]">Immediate Support</span>
            <span className="text-[11px] bg-[#fdf3ee] text-[#c45524] border border-[#f5dbcf] px-2 py-0.2">
              Physical Education Directorate
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#1a2639] mt-0.5">
            In Case of Any Problem: Contact
          </h2>
          <p className="text-xs text-[#636a77] mt-1">
            If you encounter gate entry discrepancies, equipment faults, or scheduling conflicts,
            reach out to the on-duty sports desk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: RR Campus Office */}
          <div className="bg-white border border-[#ded9cd] border-l-4 border-l-[#1a2639] p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-[#f5f4ef] text-[#1a2639] border border-[#ded9cd]">
                <Building2 className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-[#1a2639]">RR Campus Sports Desk</h3>
                <p className="text-xs text-[#636a77]">Ring Road Campus, Bangalore</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#4b5260] pt-2 border-t border-[#eeeae1]">
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#c45524] shrink-0" />
                <span>GJ Block Ground Floor, Sports Complex Wing</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#1a2639] shrink-0" />
                <span>Ext. 2401 · Direct: +91 (080) 2672 1983</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-[#1a2639] shrink-0" />
                <span>Duty Desk: 06:00 to 22:00 Daily</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#c45524] shrink-0" />
                <a href="mailto:sports.rr@pes.edu" className="hover:underline text-[#1a2639]">
                  sports.rr@pes.edu
                </a>
              </p>
            </div>
          </div>

          {/* Card 2: EC Campus Office */}
          <div className="bg-white border border-[#ded9cd] border-l-4 border-l-[#1a2639] p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-[#f5f4ef] text-[#1a2639] border border-[#ded9cd]">
                <Building2 className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-[#1a2639]">EC Campus Sports Desk</h3>
                <p className="text-xs text-[#636a77]">Electronic City Campus, Bangalore</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#4b5260] pt-2 border-t border-[#eeeae1]">
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#c45524] shrink-0" />
                <span>Sports Complex Block & Box Turf Arena</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#1a2639] shrink-0" />
                <span>Ext. 1105 · Direct: +91 (080) 6618 6611</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-[#1a2639] shrink-0" />
                <span>Duty Desk: 06:00 to 22:00 Daily</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#c45524] shrink-0" />
                <a href="mailto:sports.ec@pes.edu" className="hover:underline text-[#1a2639]">
                  sports.ec@pes.edu
                </a>
              </p>
            </div>
          </div>

          {/* Card 3: Emergency & Turnstile Assistance */}
          <div className="bg-white border border-[#ded9cd] border-l-4 border-l-[#c45524] p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-[#fdf3ee] text-[#c45524] border border-[#f5dbcf]">
                <ShieldAlert className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-[#1a2639]">Turnstile Emergency Helpline</h3>
                <p className="text-xs text-[#636a77]">Gate Scan & Clearance Issues</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#4b5260] pt-2 border-t border-[#eeeae1]">
              <p className="leading-relaxed">
                If your student card does not unlock the gate scanner, verify that your sports
                clearance shows <strong>Active</strong> in your profile.
              </p>
              <p className="flex items-center gap-2 font-medium text-[#1a2639]">
                <Phone className="h-3.5 w-3.5 text-[#c45524]" />
                <span>Gate Control Desk: +91 99000 12345</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#1a2639]" />
                <a href="mailto:facilities@pes.edu" className="hover:underline text-[#1a2639]">
                  facilities@pes.edu
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FREQUENTLY ASKED QUESTIONS */}
      <section id="faqs" className="space-y-5">
        <div className="border-b-2 border-[#1a2639] pb-3">
          <span className="text-xs font-semibold text-[#c45524]">Help Guidelines</span>
          <h2 className="text-2xl font-bold text-[#1a2639] mt-0.5">Frequently Asked Questions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FAQS.map((item, i) => (
            <div key={i} className="bg-white border border-[#ded9cd] p-6 shadow-xs space-y-2">
              <div className="flex items-start gap-2.5">
                <HelpCircle className="h-4 w-4 text-[#c45524] shrink-0 mt-0.5" />
                <h3 className="font-bold text-sm text-[#1a2639]">{item.q}</h3>
              </div>
              <p className="text-xs text-[#4b5260] leading-relaxed pl-6.5">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TICKET / ISSUE REPORT FORM */}
      <section id="report" className="space-y-5">
        <div className="border-b-2 border-[#1a2639] pb-3">
          <span className="text-xs font-semibold text-[#c45524]">Direct Resolution</span>
          <h2 className="text-2xl font-bold text-[#1a2639] mt-0.5">
            Submit an Inquiry or Report a Problem
          </h2>
        </div>

        <div className="bg-white border border-[#ded9cd] p-6 sm:p-8 shadow-xs max-w-3xl">
          {submitted ? (
            <div className="p-6 bg-[#f0fdf4] border border-[#bbf7d0] text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-[#166534] mx-auto" />
              <h3 className="font-bold text-sm text-[#166534]">Inquiry Successfully Logged!</h3>
              <p className="text-xs text-[#4b5260]">
                A support ticket has been forwarded to the Department of Physical Education desk.
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
                    placeholder="e.g. Rishit Tathod"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none focus:border-[#1a2639] text-[#1a2639]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4b5260] mb-1">
                    Student SRN / PRN
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PES1UG21CS123"
                    value={inquirySrn}
                    onChange={(e) => setInquirySrn(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none focus:border-[#1a2639] text-[#1a2639]"
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
                  className="w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none focus:border-[#1a2639] text-[#1a2639]"
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
                  className="w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none focus:border-[#1a2639] text-[#1a2639]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  className="bg-[#c45524] hover:bg-[#b04a1d] text-white text-xs font-bold px-6 py-2 flex items-center gap-2"
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
