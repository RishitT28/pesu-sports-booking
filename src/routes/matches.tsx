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
      { title: "BookQuick — Open Squads & Game Finder" },
      {
        name: "description",
        content:
          "Connect with student athletes, join open community matches, and coordinate game rosters.",
      },
      { property: "og:title", content: "BookQuick — Open Squads & Game Finder" },
      {
        property: "og:description",
        content:
          "Connect with student athletes, join open community matches, and coordinate game rosters.",
      },
    ],
  }),
  component: MatchesPage,
});

type ChatMsg = { from: string; text: string; mine: boolean; time: string };

function MatchesPage() {
  const { matches, joinMatch, createMatch, college } = useApp();
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
  const [newCampus, setNewCampus] = useState<string>(college.campuses[0] || "Main Campus");
  const [newCourt, setNewCourt] = useState("Badminton Court 1");
  const [newTime, setNewTime] = useState("Today, 6:00 PM");
  const [newSkill, setNewSkill] = useState<"Beginner" | "Intermediate" | "Advanced">(
    "Intermediate",
  );
  const [newMaxPlayers, setNewMaxPlayers] = useState(4);

  useEffect(() => {
    if (!college.campuses.includes(newCampus as any)) {
      setNewCampus(college.campuses[0] || "Main Campus");
    }
    if (selectedCampus !== "all" && !college.campuses.includes(selectedCampus as any)) {
      setSelectedCampus("all");
    }
  }, [college]);

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
        text: `We will assemble at ${m.court} (${m.campus}) by ${m.time}. Please carry non-marking shoes and your ${college.studentIdLabel}.`,
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
    <main className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto font-serif">
      {/* 1. Header with generous padding & muted tones */}
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
              {college.shortName} Student Matchmaking
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold mt-0.5" style={{ color: college.colors.primary }}>
              Open Squads & Game Finder
            </h1>
            <p className="text-xs text-[#636a77] mt-1.5 leading-relaxed">
              Connect with fellow {college.name} students, join open games, or publish your own game roster.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`hidden sm:flex items-center gap-2 bg-[#f5f4ef] px-3.5 py-1.5 border border-[#ded9cd] text-xs font-medium ${college.buttonStyle.radiusClass}`}
              style={{ color: college.colors.primary }}
            >
              <span>Active Games:</span>
              <span className="font-bold" style={{ color: college.colors.accent || college.colors.primary }}>
                {filteredMatches.length}
              </span>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className={`text-white text-xs font-semibold px-4 py-2 flex items-center gap-2 transition-all ${college.buttonStyle.radiusClass} ${college.buttonStyle.primaryClass} ${college.buttonStyle.extraClass}`}
              style={{ backgroundColor: college.colors.primary }}
            >
              <Plus className="h-4 w-4" /> Create a Game
            </Button>
          </div>
        </div>

        {/* 2. Filter Bar */}
        <div className="mt-5 space-y-4">
          {/* Discipline Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedSport("all")}
              className={`px-3 py-1.5 text-xs font-medium border transition-colors shrink-0 ${college.buttonStyle.radiusClass} ${
                selectedSport === "all"
                  ? "text-white font-bold"
                  : "bg-[#f5f4ef] text-[#4b5260] border-[#ded9cd] hover:bg-white"
              }`}
              style={
                selectedSport === "all"
                  ? {
                      backgroundColor: college.colors.primary,
                      borderColor: college.colors.primary,
                    }
                  : undefined
              }
            >
              All Disciplines
            </button>
            {SPORTS.map((s) => {
              const active = selectedSport === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSport(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border transition-colors shrink-0 ${college.buttonStyle.radiusClass} ${
                    active
                      ? "text-white font-bold"
                      : "bg-[#f5f4ef] text-[#4b5260] border-[#ded9cd] hover:bg-white"
                  }`}
                  style={
                    active
                      ? {
                          backgroundColor: college.colors.primary,
                          borderColor: college.colors.primary,
                        }
                      : undefined
                  }
                >
                  <SportIcon sport={s.id} className="h-3.5 w-3.5" />
                  <span>{s.name}</span>
                </button>
              );
            })}
          </div>

          {/* Secondary Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
            <div className="relative sm:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8c94a0]" />
              <input
                type="text"
                placeholder="Search games, hosts, or courts…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none text-[#1a2639] placeholder:text-[#8c94a0] ${college.buttonStyle.radiusClass}`}
              />
            </div>

            <div>
              <select
                aria-label="Filter by campus"
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className={`w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none text-[#1a2639] ${college.buttonStyle.radiusClass}`}
              >
                <option value="all">All Campuses</option>
                {college.campuses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                aria-label="Filter by skill level"
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none focus:border-[#1a2639] text-[#1a2639]"
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
          <div className="bg-white border border-[#ded9cd] p-12 text-center">
            <Users className="mx-auto h-8 w-8 text-[#8c94a0]" />
            <h3 className="mt-3 text-base font-bold text-[#1a2639]">No Open Games Found</h3>
            <p className="mt-1 text-xs text-[#636a77]">
              Adjust your filters or be the first to create an open game roster for your peers.
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 bg-[#c45524] hover:bg-[#b04a1d] text-white text-xs font-semibold px-4 py-2"
            >
              Create Game
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((m) => {
              const joined = m.players.includes(USER.name);
              const full = m.players.length >= m.maxPlayers;
              const openSlots = m.maxPlayers - m.players.length;
              const pct = Math.round((m.players.length / m.maxPlayers) * 100);
              const sportObj = SPORTS.find((s) => s.id === m.sport);

              return (
                <div
                  key={m.id}
                  className={`bg-white border flex flex-col justify-between transition-all hover:shadow-xs ${college.buttonStyle.radiusClass}`}
                  style={{ borderColor: college.colors.border }}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 border-b border-[#eeeae1] pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`p-1.5 bg-[#f5f4ef] border border-[#ded9cd] text-[#1a2639] ${college.buttonStyle.radiusClass}`}>
                          <SportIcon sport={m.sport} className="h-4 w-4" />
                        </span>
                        <span className="text-xs font-bold" style={{ color: college.colors.primary }}>
                          {sportObj?.name ?? m.sport}
                        </span>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 border bg-[#f5f4ef] text-[#1a2639] border-[#ded9cd] ${college.buttonStyle.radiusClass}`}>
                        {m.skill}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#1a2639] line-clamp-1">{m.title}</h3>

                    <div className="mt-3 space-y-1.5 text-xs text-[#4b5260]">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: college.colors.accent || college.colors.primary }} />
                        <span className="truncate">
                          {m.court} · <span className="font-medium" style={{ color: college.colors.primary }}>{m.campus}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-[#8c94a0] shrink-0" />
                        <span>{m.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#636a77]">
                        <span>Host:</span>
                        <span className="font-semibold" style={{ color: college.colors.primary }}>{m.host}</span>
                      </div>
                    </div>

                    {/* Roster Slot Indicator */}
                    <div className="mt-4 pt-3 border-t border-[#eeeae1]">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-[#636a77]">
                          Roster ({m.players.length}/{m.maxPlayers})
                        </span>
                        <span
                          className="font-semibold"
                          style={{ color: full ? "#b94236" : college.colors.accent || college.colors.primary }}
                        >
                          {full ? "Full" : `${openSlots} Spot${openSlots > 1 ? "s" : ""} Left`}
                        </span>
                      </div>

                      <div className="h-1.5 w-full bg-[#f5f4ef] overflow-hidden border border-[#ded9cd]">
                        <div
                          className="h-full transition-all"
                          style={{
                            backgroundColor: full ? college.colors.primary : college.colors.accent || college.colors.primary,
                            width: `${pct}%`,
                          }}
                        />
                      </div>

                      <div className="mt-3 flex items-center gap-1.5 overflow-hidden">
                        {m.players.map((p, i) => (
                          <span
                            key={i}
                            title={p}
                            className={`h-6 px-2 bg-[#f5f4ef] border border-[#ded9cd] text-[11px] font-medium text-[#1a2639] flex items-center justify-center shrink-0 ${college.buttonStyle.radiusClass}`}
                          >
                            {p.split(" ")[0]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f5f4ef] border-t border-[#ded9cd] p-3.5 flex items-center justify-between gap-2">
                    {joined ? (
                      <button
                        onClick={() => openChat(m)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-white border border-[#1a2639] text-[#1a2639] hover:bg-[#1a2639] hover:text-white transition-colors text-xs font-semibold ${college.buttonStyle.radiusClass}`}
                      >
                        <MessageCircle className="h-3.5 w-3.5" /> Team Chat
                      </button>
                    ) : (
                      <span className="text-xs text-[#636a77]">Free entry · Carry {college.studentIdLabel}</span>
                    )}

                    <Button
                      onClick={() => joinMatch(m.id)}
                      disabled={joined || full}
                      className={`text-xs font-semibold px-4 py-1.5 transition-all ${college.buttonStyle.radiusClass} ${college.buttonStyle.primaryClass} ${college.buttonStyle.extraClass} ${
                        joined
                          ? "bg-[#ebe7df] text-[#636a77] cursor-default hover:bg-[#ebe7df]"
                          : full
                            ? "bg-[#ebe7df] text-[#8c94a0] cursor-not-allowed hover:bg-[#ebe7df]"
                            : "text-white"
                      }`}
                      style={!joined && !full ? { backgroundColor: college.colors.primary } : undefined}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className={`w-full max-w-lg bg-white border shadow-2xl p-6 sm:p-8 animate-in fade-in ${college.buttonStyle.radiusClass}`}
            style={{
              borderColor: college.colors.border,
              borderTopWidth: "4px",
              borderTopColor: college.colors.primary,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#eeeae1] pb-3 mb-4">
              <div>
                <span className="text-xs font-semibold" style={{ color: college.colors.accent || college.colors.primary }}>
                  Assemble a Squad at {college.shortName}
                </span>
                <h2 className="text-lg font-bold" style={{ color: college.colors.primary }}>Create Open Game</h2>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-[#636a77] hover:text-[#1a2639]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4b5260] mb-1">
                  Game Title / Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Doubles practice — looking for 2 players"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={`w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none text-[#1a2639] ${college.buttonStyle.radiusClass}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4b5260] mb-1">Discipline</label>
                  <select
                    value={newSport}
                    onChange={(e) => {
                      setNewSport(e.target.value);
                      const matchingCourt = COURTS.find((c) => c.sport === e.target.value);
                      if (matchingCourt) setNewCourt(matchingCourt.name);
                    }}
                    className={`w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none text-[#1a2639] ${college.buttonStyle.radiusClass}`}
                  >
                    {SPORTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4b5260] mb-1">Campus</label>
                  <select
                    value={newCampus}
                    onChange={(e) => setNewCampus(e.target.value)}
                    className={`w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none text-[#1a2639] ${college.buttonStyle.radiusClass}`}
                  >
                    {college.campuses.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4b5260] mb-1">
                    Court / Location
                  </label>
                  <input
                    type="text"
                    value={newCourt}
                    onChange={(e) => setNewCourt(e.target.value)}
                    placeholder="e.g. Badminton Court 1"
                    className={`w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none text-[#1a2639] ${college.buttonStyle.radiusClass}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4b5260] mb-1">Time</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. Today, 6:00 PM"
                    className={`w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none text-[#1a2639] ${college.buttonStyle.radiusClass}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4b5260] mb-1">Skill Level</label>
                  <select
                    value={newSkill}
                    onChange={(e) =>
                      setNewSkill(e.target.value as "Beginner" | "Intermediate" | "Advanced")
                    }
                    className={`w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none text-[#1a2639] ${college.buttonStyle.radiusClass}`}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4b5260] mb-1">Max Players</label>
                  <input
                    type="number"
                    min={2}
                    max={20}
                    value={newMaxPlayers}
                    onChange={(e) => setNewMaxPlayers(Number(e.target.value))}
                    className={`w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none text-[#1a2639] ${college.buttonStyle.radiusClass}`}
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#eeeae1]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs text-[#636a77] hover:text-[#1a2639]"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  className={`text-white text-xs font-semibold px-5 py-2 transition-all ${college.buttonStyle.radiusClass} ${college.buttonStyle.primaryClass} ${college.buttonStyle.extraClass}`}
                  style={{ backgroundColor: college.colors.primary }}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setChatMatch(null)}
        >
          <div
            className={`flex h-[520px] w-full max-w-md flex-col bg-white border shadow-2xl overflow-hidden ${college.buttonStyle.radiusClass}`}
            style={{
              borderColor: college.colors.border,
              borderTopWidth: "4px",
              borderTopColor: college.colors.primary,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between border-b text-white p-4"
              style={{ backgroundColor: college.colors.ribbonBg || college.colors.primary }}
            >
              <div className="min-w-0">
                <span className="text-[10px] font-semibold" style={{ color: college.colors.accent || "#f0a27f" }}>
                  Squad Coordination
                </span>
                <p className="truncate text-sm font-bold text-white">{chatMatch.title}</p>
                <p className="text-xs text-white/80 mt-0.5">
                  {chatMatch.court} ({chatMatch.campus}) · {chatMatch.players.length} Athletes
                </p>
              </div>
              <button
                onClick={() => setChatMatch(null)}
                className="p-1 text-white/80 hover:text-white"
                aria-label="Close coordination dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-[#f5f4ef] border-b border-[#ded9cd] px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                "I'll bring extra gear",
                "On my way to court",
                "Ready to warm up",
                "Carrying extra shuttles",
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className={`shrink-0 text-xs px-2.5 py-1 bg-white border border-[#ded9cd] text-[#4b5260] hover:text-[#1a2639] transition-colors ${college.buttonStyle.radiusClass}`}
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4 bg-[#f5f4ef]">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] p-3 text-xs border ${college.buttonStyle.radiusClass} ${
                      msg.mine
                        ? "text-white"
                        : "bg-white text-[#1a2639] border-[#ded9cd] shadow-2xs"
                    }`}
                    style={
                      msg.mine
                        ? {
                            backgroundColor: college.colors.primary,
                            borderColor: college.colors.primary,
                          }
                        : undefined
                    }
                  >
                    {!msg.mine && (
                      <p className="mb-1 text-xs font-bold" style={{ color: college.colors.accent || college.colors.primary }}>
                        {msg.from}
                      </p>
                    )}
                    <p className="leading-relaxed">{msg.text}</p>
                    <p
                      className={`mt-1 text-[10px] text-right ${msg.mine ? "text-white/70" : "text-[#8c94a0]"}`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="flex gap-2 border-t border-[#ded9cd] bg-white p-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Message your game roster…"
                className={`flex-1 border border-[#ded9cd] bg-[#f5f4ef] px-3 py-2 text-xs text-[#1a2639] outline-none ${college.buttonStyle.radiusClass}`}
              />
              <Button
                onClick={() => sendMessage()}
                className={`text-white px-3 py-2 flex items-center justify-center transition-all ${college.buttonStyle.radiusClass} ${college.buttonStyle.primaryClass} ${college.buttonStyle.extraClass}`}
                style={{ backgroundColor: college.colors.primary }}
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
