import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar,
  Check,
  Clock,
  Filter,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  Send,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CAMPUSES, COURTS, SPORTS, USER, type Campus, type Match } from "@/lib/data";
import { useApp } from "@/lib/store";
import { SportIcon } from "@/components/SportIcon";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/matches")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "PESU Sports — Open Squads & Game Finder" },
      {
        name: "description",
        content:
          "Connect with PES University athletes, join open community matches, and coordinate game rosters.",
      },
      { property: "og:title", content: "PESU Sports — Open Squads & Game Finder" },
      {
        property: "og:description",
        content:
          "Connect with PES University athletes, join open community matches, and coordinate game rosters.",
      },
    ],
  }),
  component: MatchesPage,
});

type ChatMsg = { from: string; text: string; mine: boolean; time: string };

function MatchesPage() {
  const { matches, joinMatch, createMatch } = useApp();
  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [selectedCampus, setSelectedCampus] = useState<string>("all");
  const [selectedSkill, setSelectedSkill] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [chatMatch, setChatMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Create match form state
  const [newTitle, setNewTitle] = useState("");
  const [newSport, setNewSport] = useState("badminton");
  const [newCampus, setNewCampus] = useState<Campus>("RR Campus");
  const [newCourt, setNewCourt] = useState("Badminton Court 1");
  const [newTime, setNewTime] = useState("Today, 6:00 PM");
  const [newSkill, setNewSkill] = useState<"Beginner" | "Intermediate" | "Advanced">(
    "Intermediate",
  );
  const [newMaxPlayers, setNewMaxPlayers] = useState(4);

  // Filter matches
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      const matchSport = selectedSport === "all" || m.sport === selectedSport;
      const matchCampus = selectedCampus === "all" || m.campus === selectedCampus;
      const matchSkill = selectedSkill === "all" || m.skill === selectedSkill;
      const matchSearch =
        !searchQuery.trim() ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.court.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.host.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSport && matchCampus && matchSkill && matchSearch;
    });
  }, [matches, selectedSport, selectedCampus, selectedSkill, searchQuery]);

  const openChat = (m: Match) => {
    setChatMatch(m);
    setMessages([
      {
        from: m.host,
        text: `Hey team! Welcome to "${m.title}".`,
        mine: m.host === USER.name,
        time: "10m ago",
      },
      {
        from: m.host,
        text: `We will assemble at ${m.court} (${m.campus}) by ${m.time}. Carry non-marking shoes and your student RFID.`,
        mine: m.host === USER.name,
        time: "5m ago",
      },
    ]);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (textToSend?: string) => {
    const text = (textToSend ?? draft).trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        from: USER.name,
        text,
        mine: true,
        time: "Just now",
      },
    ]);
    if (!textToSend) setDraft("");

    // Simulated squad response
    setTimeout(() => {
      if (chatMatch) {
        setMessages((prev) => [
          ...prev,
          {
            from: chatMatch.host === USER.name ? "Dev P." : chatMatch.host,
            text: "Got it! See you at the court.",
            mine: false,
            time: "Just now",
          },
        ]);
      }
    }, 1200);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createMatch({
      title: newTitle.trim(),
      sport: newSport,
      campus: newCampus,
      court: newCourt,
      time: newTime,
      skill: newSkill,
      maxPlayers: Number(newMaxPlayers) || 4,
      host: USER.name,
    });

    setShowCreateModal(false);
    setNewTitle("");
  };

  return (
    <main className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* 1. Header with Editorial Brand Line */}
      <div className="bg-white border border-[#e5e7eb] border-l-4 border-l-[#0d1b2a] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#f1f3f6] pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#e35925]">
              PESU Athlete Community
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111827] uppercase tracking-tight">
              Open Squads & Game Finder
            </h1>
            <p className="text-xs text-[#64748b] mt-1 font-medium">
              Join active runs, challenge other student athletes, or assemble your own game roster.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-[#f8f8fa] px-3 py-1.5 border border-[#e5e7eb] text-xs font-bold text-[#0d1b2a]">
              <span>Active Games:</span>
              <span className="text-[#e35925]">{filteredMatches.length}</span>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#e35925] hover:bg-[#c84a1b] text-white rounded-none uppercase text-xs font-bold tracking-wider px-5 py-2 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Create a Game
            </Button>
          </div>
        </div>

        {/* 2. Filter Bar */}
        <div className="mt-5 space-y-3">
          {/* Discipline Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedSport("all")}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none border transition-colors shrink-0 ${
                selectedSport === "all"
                  ? "bg-[#0d1b2a] text-white border-[#0d1b2a]"
                  : "bg-[#f8f8fa] text-[#475569] border-[#e5e7eb] hover:bg-white hover:text-[#111827]"
              }`}
            >
              All Disciplines
            </button>
            {SPORTS.map((s) => {
              const active = selectedSport === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSport(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none border transition-colors shrink-0 ${
                    active
                      ? "bg-[#0d1b2a] text-white border-[#0d1b2a]"
                      : "bg-[#f8f8fa] text-[#475569] border-[#e5e7eb] hover:bg-white hover:text-[#111827]"
                  }`}
                >
                  <SportIcon sport={s.id} className="h-3.5 w-3.5" />
                  <span>{s.name}</span>
                </button>
              );
            })}
          </div>

          {/* Secondary Filters & Search Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
            {/* Search */}
            <div className="relative sm:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8]" />
              <input
                type="text"
                placeholder="Search games, hosts, or courts…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f8f8fa] border border-[#e5e7eb] rounded-none outline-none focus:border-[#0d1b2a] text-[#111827] placeholder:text-[#94a3b8]"
              />
            </div>

            {/* Campus filter */}
            <div>
              <select
                aria-label="Filter by campus"
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-[#f8f8fa] border border-[#e5e7eb] rounded-none outline-none focus:border-[#0d1b2a] text-[#111827]"
              >
                <option value="all">All Campuses</option>
                {CAMPUSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Skill level filter */}
            <div>
              <select
                aria-label="Filter by skill level"
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-[#f8f8fa] border border-[#e5e7eb] rounded-none outline-none focus:border-[#0d1b2a] text-[#111827]"
              >
                <option value="all">All Skill Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Games Grid */}
      <div>
        {filteredMatches.length === 0 ? (
          <div className="bg-white border border-[#e5e7eb] p-12 text-center rounded-none">
            <Users className="mx-auto h-8 w-8 text-[#94a3b8]" />
            <h3 className="mt-3 text-base font-black uppercase text-[#111827]">
              No Open Games Found
            </h3>
            <p className="mt-1 text-xs text-[#64748b]">
              Adjust your filters or be the first to create an open game roster for your peers.
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 bg-[#e35925] hover:bg-[#c84a1b] text-white rounded-none uppercase text-xs font-bold px-4 py-2"
            >
              Create Game
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMatches.map((m) => {
              const joined = m.players.includes(USER.name);
              const full = m.players.length >= m.maxPlayers;
              const openSlots = m.maxPlayers - m.players.length;
              const pct = Math.round((m.players.length / m.maxPlayers) * 100);
              const sportObj = SPORTS.find((s) => s.id === m.sport);

              return (
                <div
                  key={m.id}
                  className="bg-white border border-[#e5e7eb] rounded-none flex flex-col justify-between transition-all hover:border-[#0d1b2a] hover:shadow-sm"
                >
                  {/* Top card block */}
                  <div className="p-5">
                    {/* Header line with sport badge and skill pill */}
                    <div className="flex items-center justify-between gap-2 border-b border-[#f1f3f6] pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-[#f8f8fa] border border-[#e5e7eb] text-[#0d1b2a]">
                          <SportIcon sport={m.sport} className="h-4 w-4" />
                        </span>
                        <span className="text-xs font-black uppercase tracking-wider text-[#0d1b2a]">
                          {sportObj?.name ?? m.sport}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border ${
                          m.skill === "Advanced"
                            ? "bg-[#fef2f2] text-[#991b1b] border-[#fecaca]"
                            : m.skill === "Intermediate"
                              ? "bg-[#fff7ed] text-[#c2410c] border-[#ffedd5]"
                              : "bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]"
                        }`}
                      >
                        {m.skill}
                      </span>
                    </div>

                    {/* Game title & timing */}
                    <h3 className="text-sm font-black text-[#111827] uppercase tracking-tight line-clamp-1">
                      {m.title}
                    </h3>

                    <div className="mt-2.5 space-y-1.5 text-xs text-[#475569]">
                      <div className="flex items-center gap-2 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-[#e35925] shrink-0" />
                        <span className="truncate">
                          {m.court} · <span className="text-[#0d1b2a] font-bold">{m.campus}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-[#94a3b8] shrink-0" />
                        <span>{m.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#64748b]">
                        <span>Organized by</span>
                        <span className="font-bold text-[#111827]">{m.host}</span>
                      </div>
                    </div>

                    {/* Roster Slot Indicator */}
                    <div className="mt-4 pt-3 border-t border-[#f1f3f6]">
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="font-bold uppercase tracking-wider text-[#64748b]">
                          Roster ({m.players.length}/{m.maxPlayers})
                        </span>
                        <span
                          className={`font-black uppercase tracking-wider ${
                            full ? "text-[#dc2626]" : "text-[#e35925]"
                          }`}
                        >
                          {full ? "Full" : `${openSlots} Spot${openSlots > 1 ? "s" : ""} Left`}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-1.5 w-full bg-[#f1f3f6] overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            full ? "bg-[#0d1b2a]" : "bg-[#e35925]"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      {/* Player Avatars */}
                      <div className="mt-2.5 flex items-center gap-1 overflow-hidden">
                        {m.players.map((p, i) => (
                          <span
                            key={i}
                            title={p}
                            className="h-6 px-1.5 bg-[#f8f8fa] border border-[#e5e7eb] text-[10px] font-bold text-[#0d1b2a] flex items-center justify-center shrink-0 uppercase"
                          >
                            {p.split(" ")[0]}
                          </span>
                        ))}
                        {openSlots > 0 &&
                          Array.from({ length: Math.min(openSlots, 3) }).map((_, i) => (
                            <span
                              key={`empty-${i}`}
                              className="h-6 w-6 border border-dashed border-[#cbd5e1] text-[10px] text-[#94a3b8] flex items-center justify-center shrink-0"
                            >
                              +
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="bg-[#f8f8fa] border-t border-[#e5e7eb] p-3 flex items-center justify-between gap-2">
                    {joined ? (
                      <button
                        onClick={() => openChat(m)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-white border border-[#0d1b2a] text-[#0d1b2a] hover:bg-[#0d1b2a] hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                      >
                        <MessageCircle className="h-3.5 w-3.5" /> Team Chat
                      </button>
                    ) : (
                      <span className="text-[11px] font-medium text-[#64748b]">
                        Free entry · PES ID required
                      </span>
                    )}

                    <Button
                      onClick={() => joinMatch(m.id)}
                      disabled={joined || full}
                      className={`rounded-none text-xs font-bold uppercase tracking-wider px-4 py-1.5 ${
                        joined
                          ? "bg-[#e5e7eb] text-[#475569] cursor-default hover:bg-[#e5e7eb]"
                          : full
                            ? "bg-[#e5e7eb] text-[#94a3b8] cursor-not-allowed hover:bg-[#e5e7eb]"
                            : "bg-[#e35925] hover:bg-[#c84a1b] text-white"
                      }`}
                    >
                      {joined ? "Joined" : full ? "Full" : "Join Game"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Create Game Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white border border-[#e5e7eb] border-t-4 border-t-[#e35925] shadow-2xl p-6 rounded-none animate-in fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#f1f3f6] pb-3 mb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#e35925]">
                  Assemble a Squad
                </span>
                <h2 className="text-lg font-black uppercase tracking-tight text-[#111827]">
                  Create Open Game
                </h2>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-[#64748b] hover:text-[#111827]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                  Game Title / Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Doubles practice — looking for 2 players"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#f8f8fa] border border-[#e5e7eb] rounded-none outline-none focus:border-[#0d1b2a] text-[#111827]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                    Discipline
                  </label>
                  <select
                    value={newSport}
                    onChange={(e) => {
                      setNewSport(e.target.value);
                      const matchingCourt = COURTS.find((c) => c.sport === e.target.value);
                      if (matchingCourt) setNewCourt(matchingCourt.name);
                    }}
                    className="w-full px-3 py-2 text-xs bg-[#f8f8fa] border border-[#e5e7eb] rounded-none outline-none focus:border-[#0d1b2a] text-[#111827]"
                  >
                    {SPORTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                    Campus
                  </label>
                  <select
                    value={newCampus}
                    onChange={(e) => setNewCampus(e.target.value as Campus)}
                    className="w-full px-3 py-2 text-xs bg-[#f8f8fa] border border-[#e5e7eb] rounded-none outline-none focus:border-[#0d1b2a] text-[#111827]"
                  >
                    {CAMPUSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                    Facility / Court
                  </label>
                  <input
                    type="text"
                    value={newCourt}
                    onChange={(e) => setNewCourt(e.target.value)}
                    placeholder="e.g. Badminton Court 1"
                    className="w-full px-3 py-2 text-xs bg-[#f8f8fa] border border-[#e5e7eb] rounded-none outline-none focus:border-[#0d1b2a] text-[#111827]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                    Schedule / Time
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. Today, 6:00 PM"
                    className="w-full px-3 py-2 text-xs bg-[#f8f8fa] border border-[#e5e7eb] rounded-none outline-none focus:border-[#0d1b2a] text-[#111827]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                    Skill Level
                  </label>
                  <select
                    value={newSkill}
                    onChange={(e) =>
                      setNewSkill(e.target.value as "Beginner" | "Intermediate" | "Advanced")
                    }
                    className="w-full px-3 py-2 text-xs bg-[#f8f8fa] border border-[#e5e7eb] rounded-none outline-none focus:border-[#0d1b2a] text-[#111827]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                    Max Roster Size
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={20}
                    value={newMaxPlayers}
                    onChange={(e) => setNewMaxPlayers(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-[#f8f8fa] border border-[#e5e7eb] rounded-none outline-none focus:border-[#0d1b2a] text-[#111827]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#f1f3f6]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#64748b] hover:text-[#111827]"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  className="bg-[#e35925] hover:bg-[#c84a1b] text-white rounded-none uppercase text-xs font-bold tracking-wider px-5 py-2"
                >
                  Publish Game
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Squad Coordination Drawer / Chat Dialog */}
      {chatMatch && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setChatMatch(null)}
        >
          <div
            className="flex h-[540px] w-full max-w-md flex-col bg-white border border-[#e5e7eb] border-t-4 border-t-[#0d1b2a] rounded-none shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#e5e7eb] bg-[#0d1b2a] text-white p-4">
              <div className="min-w-0">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#e35925]">
                  Squad Coordination
                </span>
                <p className="truncate text-sm font-black uppercase tracking-wider text-white">
                  {chatMatch.title}
                </p>
                <p className="text-[11px] text-[#94a3b8] mt-0.5">
                  {chatMatch.court} ({chatMatch.campus}) · {chatMatch.players.length} Athletes
                </p>
              </div>
              <button
                onClick={() => setChatMatch(null)}
                className="p-1 text-[#94a3b8] hover:text-white"
                aria-label="Close coordination dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick coordination chips */}
            <div className="bg-[#f8f8fa] border-b border-[#e5e7eb] px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                "I'll bring extra gear",
                "On my way to court",
                "Ready to warm up",
                "Carrying shuttlecocks",
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-white border border-[#e5e7eb] text-[#475569] hover:border-[#0d1b2a] hover:text-[#0d1b2a] transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Messages Body */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4 bg-[#f8f8fa]">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] p-3 text-xs rounded-none border ${
                      msg.mine
                        ? "bg-[#0d1b2a] text-white border-[#0d1b2a]"
                        : "bg-white text-[#111827] border-[#e5e7eb] shadow-2xs"
                    }`}
                  >
                    {!msg.mine && (
                      <p className="mb-1 text-[10px] font-black uppercase tracking-wider text-[#e35925]">
                        {msg.from}
                      </p>
                    )}
                    <p className="leading-relaxed">{msg.text}</p>
                    <p
                      className={`mt-1 text-[9px] text-right ${
                        msg.mine ? "text-[#94a3b8]" : "text-[#94a3b8]"
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input Bar */}
            <div className="flex gap-2 border-t border-[#e5e7eb] bg-white p-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Message your game roster…"
                className="flex-1 border border-[#e5e7eb] bg-[#f8f8fa] px-3 py-2 text-xs text-[#111827] outline-none focus:border-[#0d1b2a] rounded-none"
              />
              <Button
                onClick={() => sendMessage()}
                className="bg-[#e35925] hover:bg-[#c84a1b] text-white px-3 py-2 rounded-none flex items-center justify-center"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
