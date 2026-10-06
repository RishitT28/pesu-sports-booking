import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SPORTS, USER, type Match } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/matches")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "PES Play — Find Players" },
      { name: "description", content: "Join open matches and find players across PES campuses." },
      { property: "og:title", content: "PES Play — Find Players" },
      { property: "og:description", content: "Join open matches and find players across PES campuses." },
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

  const filtered = matches.filter(
    (m) => sport === "all" || m.sport === sport,
  );

  const openChat = (m: Match) => {
    setChatMatch(m);
    setMessages([
      { from: m.host, text: `Hey! Welcome to "${m.title}" 🎉`, mine: false },
      { from: m.host, text: `We play at ${m.court}, ${m.time}. Bring your ID!`, mine: false },
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
        { from: chatMatch?.host ?? "Host", text: "Nice, see you there! 💪", mine: false },
      ]);
    }, 1200);
  };

  return (
    <main className="mx-auto max-w-md px-4 pb-28 pt-5 md:max-w-6xl md:px-6 md:pb-12">
      <h1 className="text-2xl font-bold">Find Players</h1>
      <p className="mt-1 text-sm text-muted-foreground">Join open games or host your own.</p>

      {/* Filters */}
      <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <button
          onClick={() => setSport("all")}
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
            sport === "all" ? "bg-accent text-accent-foreground" : "border border-border bg-card text-muted-foreground"
          }`}
        >
          All Sports
        </button>
        {SPORTS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSport(s.id)}
            className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${
              sport === s.id ? "bg-accent text-accent-foreground" : "border border-border bg-card text-muted-foreground"
            }`}
          >
            {s.icon} {s.name}
          </button>
        ))}
      </div>

      {/* Match cards */}
      <div className="mt-4 space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground md:col-span-2">
            No open matches for these filters. Check back soon!
          </p>
        )}
        {filtered.map((m) => {
          const s = SPORTS.find((x) => x.id === m.sport);
          const joined = m.players.includes(USER.name);
          const full = m.players.length >= m.maxPlayers;
          const pct = Math.round((m.players.length / m.maxPlayers) * 100);
          return (
            <div key={m.id} className="rounded-3xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl"
                  style={{ backgroundColor: `color-mix(in oklab, ${s?.color ?? "gray"} 18%, transparent)` }}
                >
                  {s?.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{m.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {m.host} · {m.time}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {m.court} · {m.campus}
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{m.players.length}/{m.maxPlayers} players</span>
                  <span>{full ? "Full" : `${m.maxPlayers - m.players.length} spots left`}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all ${full ? "bg-destructive" : "gradient-play"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {m.players.map((p) => (
                    <span
                      key={p}
                      title={p}
                      className="grid h-7 w-7 place-items-center rounded-full border-2 border-card bg-secondary text-[10px] font-bold text-primary"
                    >
                      {p[0]}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  {joined && (
                    <button
                      onClick={() => openChat(m)}
                      className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-accent transition-colors hover:border-accent/50"
                    >
                      <MessageCircle className="h-3.5 w-3.5" /> Chat
                    </button>
                  )}
                  <button
                    onClick={() => joinMatch(m.id)}
                    disabled={joined || full}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                      joined
                        ? "bg-secondary text-primary"
                        : full
                          ? "cursor-not-allowed bg-muted text-muted-foreground"
                          : "gradient-play text-primary-foreground hover:opacity-90"
                    }`}
                  >
                    {joined ? "Joined ✓" : full ? "Full" : "Join Match"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat drawer */}
      {chatMatch && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm md:items-center" onClick={() => setChatMatch(null)}>
          <div
            className="flex h-[70vh] w-full max-w-md flex-col rounded-t-3xl border border-border bg-popover md:h-[540px] md:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="min-w-0">
                <p className="truncate font-semibold">{chatMatch.title}</p>
                <p className="text-xs text-muted-foreground">{chatMatch.players.length} players · {chatMatch.time}</p>
              </div>
              <button onClick={() => setChatMatch(null)} className="shrink-0 rounded-full bg-secondary p-1.5 text-muted-foreground" aria-label="Close chat">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${msg.mine ? "gradient-play text-primary-foreground" : "bg-secondary text-foreground"}`}>
                    {!msg.mine && <p className="mb-0.5 text-[10px] font-bold text-primary">{msg.from}</p>}
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div className="flex gap-2 border-t border-border p-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Message the group…"
                className="flex-1 rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
              />
              <button onClick={send} className="gradient-play rounded-xl p-2.5 text-primary-foreground" aria-label="Send">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
