import { Heart, Pause, Play, ChevronUp, Timer, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { player, tupleEqual, usePlayerSelector } from "@/lib/player-store";
import { useT } from "@/lib/i18n";
import { NowPlaying } from "./NowPlaying";

const TIMER_PRESETS = [15, 30, 60, 120];

export function MiniPlayer() {
  const t = useT();
  const path = useRouterState({ select: (st) => st.location.pathname });
  const [open, setOpen] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);

  // Subscribe to a stable slice. `current` reference only changes on track
  // switch, `playing`/`fav`/timer values only flip on real state transitions.
  // 4 Hz `timeupdate` events no longer trigger MiniPlayer re-renders.
  const [current, playing, fav, timerMs, timerEndsAt] = usePlayerSelector(
    (s) =>
      [
        s.current,
        s.playing,
        s.favorites.has(s.current.id),
        s.timerMs,
        s.timerEndsAt,
      ] as const,
    tupleEqual,
  );


  // Live tick so the remaining-minutes label updates while a timer is active.
  const [, force] = useState(0);
  useEffect(() => {
    if (timerMs <= 0) return;
    const id = setInterval(() => force((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, [timerMs]);

  if (path === "/onboarding" || path === "/player") return null;

  const remainingMin =
    timerMs > 0 ? Math.max(1, Math.round((timerEndsAt - Date.now()) / 60000)) : 0;
  const timerActive = timerMs > 0;


  return (
    <>
      <div className="fixed bottom-16 left-0 right-0 z-30 px-3 pb-2 max-w-md mx-auto animate-fade-in-up">
        <div
          className="relative flex items-center gap-3 rounded-2xl bg-surface-elevated/90 backdrop-blur-xl p-2 pr-2 shadow-[var(--shadow-card)] border border-white/5 overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(90deg, color-mix(in oklab, ${"#000"} 0%, transparent), transparent), ${current.gradient}`,
            backgroundBlendMode: "overlay",
          }}
        >
          <div className="absolute inset-0 bg-surface-elevated/85 backdrop-blur-2xl" />

          <button
            onClick={() => setOpen(true)}
            className="relative flex items-center gap-3 flex-1 min-w-0 tap text-left"
          >
            <div
              className="h-12 w-12 rounded-xl shrink-0 shadow-md flex items-center justify-center text-2xl ring-1 ring-white/10"
              style={{ background: current.gradient }}
            >
              {current.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{current.title}</div>
              <div className="text-xs text-muted-foreground truncate">{current.artist}</div>
            </div>
            <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setTimerOpen(true); }}
            className={`relative flex items-center gap-1 px-2 h-9 rounded-full tap ring-1 transition-colors ${
              timerActive
                ? "bg-brand/20 ring-brand/40 text-foreground"
                : "bg-white/5 ring-white/10 text-muted-foreground"
            }`}
            aria-label={t("timer.title")}
          >
            <Timer className="h-4 w-4" />
            {timerActive && (
              <span className="text-[11px] font-semibold tabular-nums">{remainingMin}m</span>
            )}
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); player.toggleFav(current.id); }}
            className="relative p-2 tap"
            aria-label={t("common.favorite")}
          >
            <Heart className={`h-5 w-5 transition-all ${fav ? "fill-[oklch(0.65_0.25_25)] text-[oklch(0.65_0.25_25)] scale-110" : "text-muted-foreground"}`} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); player.toggle(); }}
            className="relative h-10 w-10 rounded-full bg-foreground text-background flex items-center justify-center tap shadow-lg"
            aria-label={playing ? t("common.pause") : t("common.play")}
          >
            {playing ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
          </button>


        </div>
      </div>

      {/* Sleep Timer sheet — controls the SAME global audio used everywhere. */}
      {timerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in-up"
          onClick={() => setTimerOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-surface-elevated rounded-t-3xl sm:rounded-3xl ring-1 ring-white/10 p-5 mb-0 sm:mb-0 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {t("timer.title")}
                </div>
                <div className="font-semibold text-foreground mt-0.5">{current.title}</div>
              </div>
              <button
                onClick={() => setTimerOpen(false)}
                className="p-2 tap text-muted-foreground"
                aria-label={t("common.close")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {timerActive && (
              <div className="flex items-center justify-between mb-4 px-4 py-3 rounded-2xl bg-brand/15 ring-1 ring-brand/30">
                <div>
                  <div className="font-semibold tabular-nums">{remainingMin} {t("timer.m")}</div>
                  <div className="text-[11px] text-muted-foreground">{t("timer.active")}</div>
                </div>
                <button
                  onClick={() => { player.clearSleepTimer(); setTimerOpen(false); }}
                  className="px-3 h-9 rounded-full bg-white/10 text-sm tap"
                >
                  {t("timer.cancel")}
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {TIMER_PRESETS.map((m) => (
                <button
                  key={m}
                  onClick={() => { player.setSleepTimer(m); setTimerOpen(false); }}
                  className="flex items-center justify-center gap-2 h-12 rounded-2xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 tap font-medium"
                >
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  {m} {t("timer.m")}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <NowPlaying open={open} onClose={() => setOpen(false)} />
    </>
  );
}
