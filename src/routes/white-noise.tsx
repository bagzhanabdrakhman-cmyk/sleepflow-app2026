import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Cat,
  Flame,
  Leaf,
  Pause,
  Play,
  Plane,
  PlaneTakeoff,
  CloudLightning,
  Train,
  Wheat,
  X,
  Timer,
  Volume2,
  Heart,
  type LucideIcon,
} from "lucide-react";

import { tracksByCategory, type Track } from "@/lib/player-store";
import { noiseMixer, useNoiseMixer } from "@/lib/noise-mixer";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/white-noise")({
  head: () => ({
    meta: [
      { title: "Белый шум — SleepFlow" },
      {
        name: "description",
        content: "Премиальный микшер белого шума: смешивайте поезд, грозу, костёр и другие звуки для глубокого сна.",
      },
    ],
  }),
  component: WhiteNoisePage,
});

type Tile = {
  icon: LucideIcon;
  /** soft pastel surface — feels premium, not neon */
  tint: string;
  /** stronger accent used for ring + icon */
  accent: string;
  group: "transport" | "nature" | "cozy";
};

const TILES: Record<string, Tile> = {
  "noise-train":      { icon: Train,           tint: "from-teal-500/25 to-teal-700/40",       accent: "#5EEAD4", group: "transport" },
  "noise-plane":      { icon: Plane,           tint: "from-slate-400/25 to-slate-700/40",     accent: "#CBD5E1", group: "transport" },
  "noise-helicopter": { icon: PlaneTakeoff,    tint: "from-indigo-500/25 to-indigo-800/40",   accent: "#A5B4FC", group: "transport" },
  "noise-leaves":     { icon: Leaf,            tint: "from-emerald-500/25 to-emerald-800/45", accent: "#6EE7B7", group: "nature" },
  "noise-thunder":    { icon: CloudLightning,  tint: "from-rose-400/25 to-rose-700/40",       accent: "#FDA4AF", group: "nature" },
  "noise-campfire":   { icon: Flame,           tint: "from-amber-400/30 to-orange-700/45",    accent: "#FCD34D", group: "cozy" },
  "noise-cat":        { icon: Cat,             tint: "from-violet-400/25 to-violet-800/40",   accent: "#C4B5FD", group: "cozy" },
  "noise-buckwheat":  { icon: Wheat,           tint: "from-yellow-400/25 to-amber-800/40",    accent: "#FDE68A", group: "cozy" },
};

const FILTERS: { id: "all" | Tile["group"]; label: string }[] = [
  { id: "all",       label: "Все" },
  { id: "transport", label: "Транспорт" },
  { id: "nature",    label: "Природа" },
  { id: "cozy",      label: "Уют" },
];

function WhiteNoisePage() {
  const tracks = tracksByCategory("noise");
  const mix = useNoiseMixer();
  const [filter, setFilter] = useState<typeof FILTERS[number]["id"]>("all");
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = useMemo(
    () => (filter === "all" ? tracks : tracks.filter((t) => TILES[t.id]?.group === filter)),
    [tracks, filter],
  );

  const activeTracks = tracks.filter((t) => mix.active.has(t.id));
  const masterPlaying = activeTracks.length > 0;

  return (
    <div className="relative pb-40 animate-fade-in-up">
      {/* Ambient backdrop — sits behind content */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.10),transparent_60%)]" />
        <div className="absolute inset-0 starfield opacity-30" />
      </div>

      <div className="space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground tap"
        >
          <ArrowLeft className="h-4 w-4" /> Назад
        </Link>

        {/* Header */}
        <header className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground/70">
            Sleep Mixer
          </p>
          <h1 className="text-[32px] font-semibold tracking-tight leading-none">Белый шум</h1>
          <p className="text-sm text-muted-foreground/85 pt-1">
            Смешивайте звуки и засыпайте быстрее.
          </p>
        </header>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1 scrollbar-none">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "shrink-0 px-4 h-9 rounded-full text-[13px] font-medium tap transition-all",
                  active
                    ? "bg-foreground text-background shadow-[0_4px_20px_-4px_rgba(255,255,255,0.35)]"
                    : "bg-white/[0.06] text-foreground/80 ring-1 ring-white/10 hover:bg-white/[0.10]",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Tile grid — Apple/Calm-style icon tiles */}
        <section className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {filtered.map((tr, i) => (
            <NoiseTile key={tr.id} track={tr} index={i} />
          ))}
        </section>

        {/* Sound count + tip */}
        <p className="text-center text-[11px] text-muted-foreground/60 tracking-wide">
          {tracks.length} звуков · нажмите, чтобы добавить в микс
        </p>
      </div>

      {/* Floating mix bar */}
      {activeTracks.length > 0 && (
        <button
          onClick={() => setSheetOpen(true)}
          className="fixed left-1/2 -translate-x-1/2 bottom-24 w-[min(92%,540px)] z-40 group animate-fade-in-up"
        >
          <div className="rounded-2xl bg-black/70 backdrop-blur-xl ring-1 ring-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] px-3 py-2.5 flex items-center gap-3">
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                if (masterPlaying) noiseMixer.stopAll();
              }}
              className="h-10 w-10 shrink-0 rounded-full bg-white text-black grid place-items-center shadow-[0_6px_20px_rgba(255,255,255,0.25)] active:scale-95 transition cursor-pointer"
            >
              <Pause className="h-4 w-4 fill-current" />
            </span>
            <div className="min-w-0 text-left flex-1">
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/55">
                Смешать · {activeTracks.length}
              </div>
              <div className="text-[13px] text-white truncate font-medium">
                {activeTracks.map((t) => t.title).join(" · ")}
              </div>
            </div>
            <div className="h-9 w-9 grid place-items-center rounded-full bg-white/10 ring-1 ring-white/15 text-white/80">
              <Volume2 className="h-4 w-4" />
            </div>
          </div>
        </button>
      )}

      <MixerSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        tracks={activeTracks}
        mix={mix}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tile                                                              */
/* ------------------------------------------------------------------ */

function NoiseTile({ track, index }: { track: Track; index: number }) {
  const mix = useNoiseMixer();
  const tile = TILES[track.id];
  const Icon = tile?.icon ?? Volume2;
  const active = mix.active.has(track.id);

  return (
    <button
      onClick={() => { if (track.url) void noiseMixer.toggle(track.id, track.url); }}
      aria-pressed={active}
      aria-label={track.title}
      style={{ animationDelay: `${index * 35}ms` }}
      className="group flex flex-col items-center gap-2 tap animate-fade-in-up"
    >
      <div
        className={cn(
          "relative aspect-square w-full rounded-[22px] overflow-hidden transition-all duration-300",
          "bg-gradient-to-br ring-1 ring-white/10",
          tile?.tint ?? "from-slate-700/30 to-slate-900/40",
          active
            ? "scale-[1.03] shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6)]"
            : "group-hover:scale-[1.02] group-active:scale-[0.97]",
        )}
      >
        {/* Inner glow when active */}
        {active && (
          <div
            className="absolute inset-0 opacity-90"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${tile?.accent}33, transparent 70%)`,
              boxShadow: `inset 0 0 0 1.5px ${tile?.accent}`,
            }}
          />
        )}
        {/* Subtle top sheen */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent" />

        <div className="absolute inset-0 grid place-items-center">
          <Icon
            className={cn(
              "transition-all duration-300",
              active ? "h-9 w-9" : "h-8 w-8",
            )}
            style={{ color: tile?.accent ?? "#fff", strokeWidth: 1.6 }}
          />
        </div>

        {/* Active pulse dot */}
        {active && (
          <span
            className="absolute top-2 right-2 h-2 w-2 rounded-full animate-pulse"
            style={{ background: tile?.accent, boxShadow: `0 0 8px ${tile?.accent}` }}
          />
        )}
      </div>

      <div
        className={cn(
          "text-[12px] leading-tight text-center font-medium tracking-tight line-clamp-2 transition-colors",
          active ? "text-foreground" : "text-foreground/75",
        )}
      >
        {track.title}
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Mixer Sheet                                                       */
/* ------------------------------------------------------------------ */

const TIMER_OPTIONS = [
  { mins: 0,  label: "Откл" },
  { mins: 15, label: "15м" },
  { mins: 30, label: "30м" },
  { mins: 60, label: "1ч" },
];

function MixerSheet({
  open,
  onClose,
  tracks,
  mix,
}: {
  open: boolean;
  onClose: () => void;
  tracks: Track[];
  mix: ReturnType<typeof useNoiseMixer>;
}) {
  const [timerMins, setTimerMins] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const intRef = useRef<number | null>(null);

  // Timer countdown — auto-stops mixer when it hits 0.
  useEffect(() => {
    if (intRef.current) {
      window.clearInterval(intRef.current);
      intRef.current = null;
    }
    if (timerMins <= 0) {
      setRemaining(0);
      return;
    }
    setRemaining(timerMins * 60);
    intRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (intRef.current) window.clearInterval(intRef.current);
          intRef.current = null;
          noiseMixer.stopAll();
          setTimerMins(0);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intRef.current) window.clearInterval(intRef.current);
    };
  }, [timerMins]);

  const fmtRemaining = (s: number) => {
    const m = Math.floor(s / 60);
    const ss = String(s % 60).padStart(2, "0");
    return `${m}:${ss}`;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      />
      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Микшер звуков"
        className={cn(
          "fixed left-0 right-0 bottom-0 z-50 transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="mx-auto w-full max-w-[640px] rounded-t-[28px] bg-[#0b0d18] ring-1 ring-white/10 shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.8)] max-h-[85dvh] overflow-y-auto">
          {/* Grabber */}
          <div className="pt-2 pb-1 grid place-items-center">
            <div className="h-1 w-10 rounded-full bg-white/20" />
          </div>

          <div className="px-5 pt-3 pb-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground/70">
                  Текущий микс
                </div>
                <h2 className="text-xl font-semibold tracking-tight mt-0.5">
                  Звуки <span className="text-muted-foreground/60 font-normal">({tracks.length})</span>
                </h2>
              </div>
              <button
                onClick={() => noiseMixer.stopAll()}
                disabled={tracks.length === 0}
                className="text-[13px] font-medium text-brand tap disabled:opacity-40"
              >
                Очистить все
              </button>
            </div>

            {/* Active sounds with sliders */}
            <div className="space-y-3">
              {tracks.length === 0 ? (
                <div className="rounded-2xl bg-white/5 ring-1 ring-white/5 p-6 text-center text-sm text-muted-foreground">
                  Микс пуст. Выберите звуки, чтобы начать.
                </div>
              ) : (
                tracks.map((tr) => {
                  const tile = TILES[tr.id];
                  const Icon = tile?.icon ?? Volume2;
                  const vol = mix.volumes[tr.id] ?? 0.7;
                  return (
                    <div
                      key={tr.id}
                      className="flex items-center gap-3 rounded-2xl bg-white/[0.04] ring-1 ring-white/5 p-2.5 pr-1"
                    >
                      <div
                        className="h-12 w-12 shrink-0 rounded-xl grid place-items-center bg-gradient-to-br"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${tile?.accent}30, ${tile?.accent}10)`,
                          boxShadow: `inset 0 0 0 1px ${tile?.accent}40`,
                        }}
                      >
                        <Icon className="h-5 w-5" style={{ color: tile?.accent, strokeWidth: 1.7 }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-medium truncate">{tr.title}</div>
                        <Slider
                          value={[Math.round(vol * 100)]}
                          onValueChange={(v) => noiseMixer.setVolume(tr.id, (v[0] ?? 0) / 100)}
                          min={0}
                          max={100}
                          step={1}
                          className="mt-1.5"
                        />
                      </div>
                      <button
                        onClick={() => { if (tr.url) void noiseMixer.toggle(tr.id, tr.url); }}
                        aria-label={`Убрать ${tr.title}`}
                        className="h-9 w-9 shrink-0 rounded-full grid place-items-center text-muted-foreground/70 hover:text-foreground hover:bg-white/10 tap"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Sleep timer */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-brand" />
                  <span className="text-[13px] font-medium">Таймер сна</span>
                </div>
                {remaining > 0 && (
                  <span className="text-[12px] tabular-nums text-brand/90">
                    осталось {fmtRemaining(remaining)}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {TIMER_OPTIONS.map((opt) => {
                  const active = timerMins === opt.mins;
                  return (
                    <button
                      key={opt.mins}
                      onClick={() => setTimerMins(opt.mins)}
                      className={cn(
                        "h-10 rounded-xl text-[13px] font-medium tap transition-all",
                        active
                          ? "bg-brand/20 text-brand ring-1 ring-brand/50"
                          : "bg-white/5 text-foreground/75 ring-1 ring-white/5 hover:bg-white/10",
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom actions */}
            <div className="flex items-center justify-between gap-4 pt-1">
              <button
                onClick={() => setTimerMins(timerMins === 0 ? 30 : 0)}
                className="flex flex-col items-center gap-1 text-muted-foreground/80 tap min-w-16"
              >
                <Timer className="h-5 w-5" />
                <span className="text-[10px]">Таймер</span>
              </button>

              <button
                onClick={() => {
                  if (tracks.length === 0) return;
                  // toggle pause/resume by stopping all when active.
                  noiseMixer.stopAll();
                }}
                disabled={tracks.length === 0}
                className="h-14 w-14 rounded-full bg-brand text-background grid place-items-center shadow-[0_10px_30px_-6px_rgba(99,102,241,0.6)] active:scale-95 transition disabled:opacity-40"
                aria-label={tracks.length > 0 ? "Остановить микс" : "Нет активных звуков"}
              >
                {tracks.length > 0 ? (
                  <Pause className="h-6 w-6 fill-current" />
                ) : (
                  <Play className="h-6 w-6 fill-current ml-0.5" />
                )}
              </button>

              <button
                disabled={tracks.length === 0}
                className="flex flex-col items-center gap-1 text-muted-foreground/80 tap min-w-16 disabled:opacity-40"
              >
                <Heart className="h-5 w-5" />
                <span className="text-[10px]">Сохранить</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
