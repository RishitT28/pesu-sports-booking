import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Send, Users, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SPORTS, USER, type Match } from "@/lib/data";
import { useApp } from "@/lib/store";
import { SportIcon } from "@/components/SportIcon";

export const Route = createFileRoute("/matches")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "PES University — Student Matches & Teams" },
      {
        name: "description",
        content: "Join open matches and find players across PES campuses.",
      },
      { property: "og:title", content: "PES University — Student Matches & Teams" },
      {
        property: "og:description",
        content: "Join open matches and find players across PES campuses.",
      },
    ],
  }),
  component: Matches,
});

type ChatMsg = { from: string; text: string; mine: boolean };

function Matches() {
  const { matches, joinMatch } = useApp();
  const [sport, setSport] = useState<string>("all");
  const [chatMatch, setChatMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const filtered = matches.filter((m) => sport === "all" || m.sport === sport);

  const openChat = (m: Match) => {
    setChatMatch(m);
    setMessages([
      { from: m.host, text: `Welcome to "${m.title}".`, mine: false },
      {
        from: m.host,
        text: `We play at ${m.court}, ${m.time}. Please carry your PESU Student ID.`,
        mine: false,
      },
    ]);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!draft.trim()) return;
    setMessages((p) => [...p, { from: USER.name, text: draft.trim(), mine: true }]);
    setDraft("");
    setTimeout(() => {
      setMessages((p) => [
        ...p,
        {
          from: chatMatch?.host ?? "Host",
          text: "Acknowledged, see you at the court.",
          mine: false,
        },
      ]);
    }, 1000);
  };

  return (
    <main className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title & Filter Header */}
      <div className="bg-white border border-[#cbd5e1] p-4 rounded-none shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e2e8f0] pb-3">
          <div>
            <h1 className="text-xl font-bold text-[#084d7a] uppercase tracking-wide">
              Student Matches & Team Finder
            </h1>
            <p className="text-xs text-[#64748b] mt-0.5">
              Connect with fellow students, join open games, and coordinate practice matches
            </p>
          </div>
          <div className="text-xs font-mono text-[#084d7a] bg-[#f0f3f6] px-3 py-1.5 border border-[#dbe2ea] rounded-none">
            Active Games: {filtered.length}
          </div>
        </div>

        {/* Sport Filters */}
        <div className="mt-4">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1.5">
            Filter By Sport
          </label>
          <div className="no-scrollbar flex flex-wrap gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setSport("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-none transition-colors border ${
                sport === "all"
                  ? "bg-[#0080b0] text-white border-[#0080b0]"
                  : "bg-white text-[#334155] border-[#cbd5e1] hover:bg-[#f1f5f9]"
              }`}
            >
              All Sports
            </button>
            {SPORTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSport(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-none transition-colors border ${
                  sport === s.id
                    ? "bg-[#0080b0] text-white border-[#0080b0]"
                    : "bg-white text-[#334155] border-[#cbd5e1] hover:bg-[#f1f5f9]"
                }`}
              >
                <SportIcon sport={s.id} className="h-3.5 w-3.5" />
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-white border border-[#cbd5e1] text-sm text-[#64748b] rounded-none md:col-span-2">
            No open games found for the selected sport. Check back soon.
          </div>
        ) : (
          filtered.map((m) => {
            const joined = m.players.includes(USER.name);
            const full = m.players.length >= m.maxPlayers;
            const pct = Math.round((m.players.length / m.maxPlayers) * 100);

            return (
              <div
                key={m.id}
                className="bg-white border border-[#cbd5e1] p-4 rounded-none shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3 border-b border-[#e2e8f0] pb-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#f0f3f6] text-[#084d7a] border border-[#dbe2ea] rounded-none">
                      <SportIcon sport={m.sport} className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h2 className="text-sm font-bold text-[#0f172a] truncate">{m.title}</h2>
                        <span className="bg-[#f0f3f6] text-[#084d7a] border border-[#dbe2ea] text-[10px] font-bold px-1.5 py-0.5 rounded-none uppercase">
                          {m.skill}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748b] mt-0.5">
                        Host: {m.host} · {m.time}
                      </p>
                      <p className="text-xs text-[#475569] font-medium">
                        {m.court} ({m.campus})
                      </p>
                    </div>
                  </div>

                  {/* Player slots meter */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-[#64748b] mb-1">
                      <span>
                        Roster: {m.players.length} / {m.maxPlayers} students
                      </span>
                      <span className="font-semibold text-[#0f172a]">
                        {full ? "Roster Full" : `${m.maxPlayers - m.players.length} spots open`}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#e2e8f0] rounded-none overflow-hidden">
                      <div
                        className={`h-full rounded-none transition-all ${
                          full ? "bg-[#d9534f]" : "bg-[#0080b0]"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Controls */}
                <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between gap-2">
                  <div className="flex -space-x-1.5">
                    {m.players.map((p) => (
                      <span
                        key={p}
                        title={p}
                        className="grid h-6 w-6 place-items-center bg-[#084d7a] text-[9px] font-bold text-white border border-white rounded-none"
                      >
                        {p[0]}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {joined && (
                      <button
                        onClick={() => openChat(m)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-none border border-[#cbd5e1] text-[#334155] bg-white hover:bg-[#f1f5f9] transition-colors"
                      >
                        <MessageCircle className="h-3.5 w-3.5 text-[#0080b0]" /> Team Chat
                      </button>
                    )}
                    <button
                      onClick={() => joinMatch(m.id)}
                      disabled={joined || full}
                      className={`px-4 py-1.5 text-xs font-semibold rounded-none transition-colors ${
                        joined
                          ? "bg-[#e2e8f0] text-[#475569] cursor-default"
                          : full
                            ? "bg-[#f1f5f9] text-[#94a3b8] border border-[#e2e8f0] cursor-not-allowed"
                            : "bg-[#0080b0] text-white hover:bg-[#006f9c]"
                      }`}
                    >
                      {joined ? "Joined" : full ? "Full" : "Join Game"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Match Coordination Chat Dialog */}
      {chatMatch && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setChatMatch(null)}
        >
          <div
            className="flex h-[520px] w-full max-w-md flex-col bg-white border border-[#cbd5e1] rounded-none shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#cbd5e1] bg-[#084d7a] text-white p-3.5">
              <div className="min-w-0">
                <p className="truncate text-xs font-bold uppercase tracking-wider">
                  {chatMatch.title}
                </p>
                <p className="text-[11px] text-[#93c5fd] mt-0.5">
                  {chatMatch.players.length} players · {chatMatch.court}
                </p>
              </div>
              <button
                onClick={() => setChatMatch(null)}
                className="p-1 text-white/80 hover:text-white rounded-none"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 space-y-2.5 overflow-y-auto p-4 bg-[#f8fafc]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-2.5 text-xs rounded-none border ${
                      msg.mine
                        ? "bg-[#0080b0] text-white border-[#0080b0]"
                        : "bg-white text-[#1e293b] border-[#cbd5e1]"
                    }`}
                  >
                    {!msg.mine && (
                      <p className="mb-0.5 text-[10px] font-bold text-[#084d7a]">{msg.from}</p>
                    )}
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input Bar */}
            <div className="flex gap-2 border-t border-[#cbd5e1] bg-white p-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type a coordination message…"
                className="flex-1 border border-[#cbd5e1] bg-white px-3 py-1.5 text-xs outline-none focus:border-[#0080b0] rounded-none"
              />
              <button
                onClick={send}
                className="bg-[#0080b0] hover:bg-[#006f9c] text-white px-3 py-1.5 text-xs font-semibold rounded-none flex items-center gap-1"
                aria-label="Send message"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
