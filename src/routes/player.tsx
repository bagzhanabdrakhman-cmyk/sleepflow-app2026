import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Pause, Play, SkipBack, SkipForward, Moon, Heart, Repeat, Timer, X, Minus, Plus, Volume2, VolumeX } from "lucide-react";
import { player, usePlayer } from "@/lib/player-store";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/player")({
  head: () => ({ meta: [{ title: "Sleep Player — SleepFlow" }] }),
  component: PlayerPage,
});

const PRESETS = [
  { min: 30, titleKey: "timer.preset.30.title", labelKey: "timer.preset.30.label" },
  { min: 60, titleKey: "timer.preset.60.title", labelKey: "timer.preset.60.label" },
  { min: 480, titleKey: "timer.preset.480.title", labelKey: "timer.preset.480.label" },
];

function PlayerPage() {
  const tr = useT();
  const s = usePlayer();
  const nav = useNavigate();
  const [timerOpen, setTimerOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [hours, setHours] = useState(1);
  const [mins, setMins] = useState(0);

  // Player respects whatever track is currently loaded — never override the
  // user's selection (e.g. a Baby Sleep track) with a Sleep-category fallback.

  const t = s.current;
  const customTotal = hours * 60 + mins;
  const remainingMin = s.timerMs > 0 ? Math.max(1, Math.round((s.timerEndsAt - Date.now()) / 60000)) : 0;

  const startPreset = (m: number) => {
    player.setSleepTimer(m);
    setTimerOpen(false);
    setCustomOpen(false);
  };
  const confirmCustom = () => {
    if (customTotal <= 0) return;
    player.setSleepTimer(customTotal);
    setTimerOpen(false);
    setCustomOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col text-white animate-fade-in-up overflow-hidden"
      style={{ background: t.gradient }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/65 to-black/95" />
      <div className="absolute inset-0 starfield opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.18),transparent_60%)]" />

      <div className="relative flex items-center justify-between px-5 pt-6 pb-2">
        <button onClick={() => nav({ to: "/" })} aria-label={tr("common.close")} className="p-2 -ml-2 tap">
          <ChevronDown className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-white/80">
          <Moon className="h-3.5 w-3.5" /> {tr("player.label")}
        </div>
        <div className="w-6" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center px-8">
        <div className="relative">
          <div className="absolute inset-0 -m-10 rounded-full moon-glow opacity-50 blur-2xl pointer-events-none" />
          <div
            className={`relative h-56 w-56 rounded-[2rem] flex items-center justify-center text-8xl shadow-2xl ring-1 ring-white/25 transition-transform duration-700 ${
              s.playing ? "scale-100" : "scale-95"
            }`}
            style={{ background: t.gradient }}
          >
            <span className={s.playing ? "animate-pulse" : ""}>{t.icon}</span>
          </div>
        </div>
        <h2 className="mt-10 text-3xl font-bold tracking-tight text-center">{t.title}</h2>
        <p className="mt-1 text-sm text-white/70">{t.artist}</p>
      </div>

      <div className="relative px-6 pb-10 space-y-6">

        {/* Seek slider — premium thin track with glowing thumb */}
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={s.progress || 0}
          onChange={(e) => player.seek(parseFloat(e.target.value))}
          aria-label="Seek"
          className="seek-premium w-full cursor-pointer appearance-none"
          style={{ ["--seek-progress" as string]: `${(s.progress || 0) * 100}%` }}
        />

        <div className="flex items-center justify-center gap-8">
          <button onClick={() => player.prev()} aria-label={tr("common.previous")} className="p-3 tap text-white/90">
            <SkipBack className="h-7 w-7 fill-current" />
          </button>
          <button
            onClick={() => player.toggle()}
            aria-label={s.playing ? tr("common.pause") : tr("common.play")}
            className="h-20 w-20 rounded-full bg-white text-black flex items-center justify-center tap shadow-2xl"
          >
            {s.playing ? <Pause className="h-9 w-9 fill-current" /> : <Play className="h-9 w-9 fill-current ml-1" />}
          </button>
          <button onClick={() => player.next()} aria-label={tr("common.next")} className="p-3 tap text-white/90">
            <SkipForward className="h-7 w-7 fill-current" />
          </button>
        </div>

        <div className="flex items-center justify-around pt-1">
          <button
            onClick={() => player.toggleRepeat()}
            aria-label={tr("common.repeat")}
            className={`tap ${s.repeat ? "text-white" : "text-white/60"}`}
          >
            <Repeat className="h-4 w-4" />
          </button>
          <button
            onClick={() => player.toggleFav(t.id)}
            aria-label={tr("common.favorite")}
            className={`tap ${s.favorites.has(t.id) ? "text-pink-300" : "text-white/60"}`}
          >
            <Heart className={`h-4 w-4 ${s.favorites.has(t.id) ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

      {/* Right-side rail: volume + timer */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-3">
        {/* Compact vertical volume */}
        <div className="flex flex-col items-center gap-2 px-2 py-3 rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-md">
          <button
            onClick={() => player.setVolume(s.volume > 0 ? 0 : 0.6)}
            aria-label="Mute"
            className="text-sky-300/90 tap"
          >
            {s.volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={s.volume}
            onChange={(e) => player.setVolume(parseFloat(e.target.value))}
            aria-label="Volume"
            className="vol-vertical cursor-pointer"
            style={{
              writingMode: "vertical-lr" as never,
              direction: "rtl",
              width: 4,
              height: 80,
              accentColor: "#60a5fa",
            }}
          />
        </div>

        {/* Timer */}
        <button
          onClick={() => setTimerOpen(true)}
          aria-label={tr("timer.title")}
          className={`flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-2xl backdrop-blur-md ring-1 tap ${
            s.timerMs > 0 ? "bg-white/15 ring-white/30 text-white" : "bg-white/5 ring-white/10 text-white/70"
          }`}
        >
          <Timer className="h-5 w-5" />
          <span className="text-[10px] tabular-nums leading-none">
            {s.timerMs > 0 ? `${remainingMin}m` : tr("timer.start")}
          </span>
        </button>
      </div>

      {/* Timer panel */}
      {timerOpen && (
        <>
          <div
            className="absolute inset-0 z-20 bg-black/50 animate-fade-in-up"
            onClick={() => { setTimerOpen(false); setCustomOpen(false); }}
          />
          <div className="absolute right-0 top-0 bottom-0 z-30 w-[78%] max-w-[320px] bg-background/95 backdrop-blur-xl text-foreground p-5 flex flex-col gap-3 ring-1 ring-white/10 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{tr("timer.title")}</div>
                <div className="text-base font-semibold truncate">{t.title}</div>
              </div>
              <button
                onClick={() => { setTimerOpen(false); setCustomOpen(false); }}
                aria-label={tr("common.close")}
                className="h-9 w-9 rounded-full grid place-items-center bg-white/[0.06] tap"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {s.timerMs > 0 && (
              <div className="rounded-2xl bg-brand/15 border border-brand/40 px-4 py-3 flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-semibold tabular-nums">{remainingMin} {tr("timer.m")}</div>
                  <div className="text-[11px] text-muted-foreground">{tr("timer.active")}</div>
                </div>
                <button
                  onClick={() => player.clearSleepTimer()}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/10 tap"
                >
                  {tr("timer.cancel")}
                </button>
              </div>
            )}

            <div className="space-y-2">
              {PRESETS.map((p) => (
                <button
                  key={p.min}
                  onClick={() => startPreset(p.min)}
                  className="w-full p-3.5 rounded-2xl bg-surface border border-white/5 tap flex items-center justify-between"
                >
                  <div className="text-left">
                    <div className="font-semibold">{tr(p.titleKey)}</div>
                    <div className="text-[11px] text-muted-foreground">{tr(p.labelKey)}</div>
                  </div>
                  <Timer className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}

              <button
                onClick={() => setCustomOpen((v) => !v)}
                className={`w-full p-3.5 rounded-2xl border tap flex items-center justify-between ${
                  customOpen ? "border-brand bg-brand/10" : "border-white/5 bg-surface"
                }`}
              >
                <div className="text-left">
                  <div className="font-semibold">{tr("timer.custom.title")}</div>
                  <div className="text-[11px] text-muted-foreground">{tr("timer.custom.label")}</div>
                </div>
                <Plus className={`h-4 w-4 transition-transform ${customOpen ? "rotate-45" : ""}`} />
              </button>

              {customOpen && (
                <div className="rounded-2xl bg-surface border border-white/5 p-3 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Stepper
                      label={tr("timer.hours")}
                      value={hours}
                      onChange={setHours}
                      onStep={(d) => setHours(Math.max(0, Math.min(23, hours + d)))}
                    />
                    <Stepper
                      label={tr("timer.minutes")}
                      value={mins}
                      onChange={setMins}
                      onStep={(d) => setMins(Math.max(0, Math.min(59, mins + d)))}
                    />
                  </div>
                  <button
                    onClick={confirmCustom}
                    disabled={customTotal <= 0}
                    className="w-full h-11 rounded-xl bg-foreground text-background font-semibold tap disabled:opacity-40"
                  >
                    {tr("timer.confirm")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Stepper({
  label,
  value,
  onChange,
  onStep,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  onStep: (delta: number) => void;
}) {
  return (
    <div className="rounded-xl bg-background/40 ring-1 ring-white/10 p-2">
      <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground text-center">{label}</div>
      <div className="mt-1.5 flex items-center justify-between gap-1">
        <button
          onClick={() => onStep(-1)}
          className="h-8 w-8 rounded-lg bg-white/[0.06] grid place-items-center tap"
          aria-label="-"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            onChange(Number.isFinite(n) ? Math.max(0, n) : 0);
          }}
          className="w-10 bg-transparent text-center text-lg font-semibold tabular-nums outline-none"
          inputMode="numeric"
        />
        <button
          onClick={() => onStep(1)}
          className="h-8 w-8 rounded-lg bg-white/[0.06] grid place-items-center tap"
          aria-label="+"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
