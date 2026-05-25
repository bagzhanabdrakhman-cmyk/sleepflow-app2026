import { Play } from "lucide-react";
import type { Track } from "@/lib/player-store";
import { player, usePlayerSelector } from "@/lib/player-store";

export function MoodCard({ track, size = "md" }: { track: Track; size?: "sm" | "md" | "lg" }) {
  // Only re-render when THIS card's playing state actually flips, not on every
  // 4 Hz audio timeupdate tick.
  const isCurrent = usePlayerSelector(
    (s) => s.current.id === track.id && s.playing,
  );
  const h = size === "lg" ? "h-52" : size === "sm" ? "h-32" : "h-40";
  return (
    <button
      onClick={() => player.play(track)}
      onPointerEnter={() => player.preload(track)}
      onTouchStart={() => player.preload(track)}
      onFocus={() => player.preload(track)}
      className={`group relative ${h} w-full rounded-3xl overflow-hidden tap text-left animate-scale-in shadow-[var(--shadow-card)] ring-1 ring-white/5`}
      style={{ background: track.gradient }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.25),transparent_60%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <div className="absolute top-3 left-3 text-3xl drop-shadow-lg select-none">
        {track.icon}
      </div>

      <div
        className={`absolute top-3 right-3 h-9 w-9 rounded-full bg-white/95 text-black flex items-center justify-center shadow-lg transition-all duration-300 ${
          isCurrent ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
        }`}
      >
        <Play className="h-4 w-4 fill-current ml-0.5" />
      </div>

      <div className="absolute bottom-3 left-3 right-3">
        <div className="text-white font-bold text-lg leading-tight tracking-tight drop-shadow">
          {track.title}
        </div>
        <div className="text-white/70 text-[11px] mt-0.5 truncate">{track.artist}</div>
        {isCurrent && (
          <div className="flex items-end gap-0.5 mt-1.5 h-3">
            <span className="w-0.5 bg-white animate-bar-1" />
            <span className="w-0.5 bg-white animate-bar-2" />
            <span className="w-0.5 bg-white animate-bar-3" />
          </div>
        )}
      </div>
    </button>
  );
}
