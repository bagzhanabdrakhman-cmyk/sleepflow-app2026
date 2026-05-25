import { Play, Pause } from "lucide-react";
import { tracksByCategory } from "@/lib/player-store";
import { noiseMixer, useNoiseMixer } from "@/lib/noise-mixer";

import imgTrain from "@/assets/noise/train.jpg";
import imgPlane from "@/assets/noise/plane.jpg";
import imgHelicopter from "@/assets/noise/helicopter.jpg";
import imgCat from "@/assets/noise/cat.jpg";
import imgLeaves from "@/assets/noise/leaves.jpg";
import imgThunder from "@/assets/noise/thunder.jpg";
import imgCampfire from "@/assets/noise/campfire.jpg";
import imgBuckwheat from "@/assets/noise/buckwheat.jpg";

export const NOISE_IMAGES: Record<string, string> = {
  "noise-train": imgTrain,
  "noise-plane": imgPlane,
  "noise-helicopter": imgHelicopter,
  "noise-cat": imgCat,
  "noise-leaves": imgLeaves,
  "noise-thunder": imgThunder,
  "noise-campfire": imgCampfire,
  "noise-buckwheat": imgBuckwheat,
};

export function WhiteNoiseGrid({
  limit,
  variant = "grid",
}: {
  limit?: number;
  variant?: "grid" | "scroll";
}) {
  const mix = useNoiseMixer();
  const all = tracksByCategory("noise");
  const tracks = limit ? all.slice(0, limit) : all;

  const containerClass =
    variant === "scroll"
      ? "flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-5 px-5 scrollbar-none"
      : "grid grid-cols-2 gap-3";

  return (
    <section className={containerClass}>
      {tracks.map((tr, i) => {
        const active = mix.active.has(tr.id);
        const img = NOISE_IMAGES[tr.id];
        const cardBase =
          variant === "scroll"
            ? "group relative shrink-0 snap-start w-[calc((100%-2.25rem)/4)] aspect-[3/4]"
            : "group relative aspect-square w-full";
        const activeRing = active
          ? "ring-2 ring-amber-300 shadow-[0_0_24px_rgba(251,191,36,0.55)]"
          : "ring-1 ring-white/10 shadow-[var(--shadow-card)]";
        return (
          <button
            key={tr.id}
            onClick={() => { if (tr.url) void noiseMixer.toggle(tr.id, tr.url); }}
            className={`${cardBase} rounded-2xl overflow-hidden bg-surface tap transition-all duration-200 active:scale-[0.97] hover:scale-[1.02] animate-fade-in-up ${activeRing}`}
            style={{
              animationDelay: `${i * 40}ms`,
              background: img ? undefined : tr.gradient,
            }}
            aria-pressed={active}
            aria-label={tr.title}
          >
            {img ? (
              <img
                src={img}
                alt={tr.title}
                loading="lazy"
                width={512}
                height={512}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
                  active ? "" : "brightness-90"
                }`}
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-5xl">{tr.icon}</div>
            )}

            {/* Warm overlay when active */}
            {active && (
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/45 via-amber-400/15 to-transparent mix-blend-soft-light pointer-events-none" />
            )}

            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

            <div
              className={`absolute top-2 right-2 h-8 w-8 rounded-full grid place-items-center backdrop-blur-md ring-1 transition-all ${
                active
                  ? "bg-amber-300 text-amber-950 ring-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.8)]"
                  : "bg-black/40 text-white ring-white/25 opacity-0 group-hover:opacity-100"
              }`}
            >
              {active ? (
                <Pause className="h-3.5 w-3.5 fill-current" />
              ) : (
                <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
              )}
            </div>

            <div className="absolute inset-x-0 bottom-0 p-2.5 text-left">
              <div
                className={`font-semibold text-[13px] leading-tight tracking-tight drop-shadow line-clamp-2 ${
                  active ? "text-amber-100" : "text-white"
                }`}
              >
                {tr.title}
              </div>
              {active && (
                <div className="mt-0.5 flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-amber-300 animate-pulse" />
                  <span className="text-[10px] text-amber-200/90 uppercase tracking-wider">Playing</span>
                </div>
              )}
            </div>
          </button>
        );
      })}
    </section>
  );
}
