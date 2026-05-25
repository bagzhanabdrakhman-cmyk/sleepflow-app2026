import { Heart, Pause, Play } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import type { Track } from "@/lib/player-store";
import { player, tupleEqual, usePlayerSelector } from "@/lib/player-store";

type Props = {
  track: Track;
  /** Optional override for the subtitle (mood, time-ago, etc). */
  subtitle?: string;
};

/**
 * Premium sleep-friendly list row.
 * - Tap card → starts playback instantly + navigates to /player
 * - Tap play  → starts/toggles playback with gentle fade-in
 * - Tap heart → toggles favorite
 *
 * Subscribes only to a 3-tuple slice of player state. List pages can render
 * dozens of these rows; without the selector, every `timeupdate` (4 Hz) would
 * re-render every row and freeze the UI.
 */
export function TrackRow({ track, subtitle }: Props) {
  const nav = useNavigate();
  const [isCurrent, isPlaying, isFav] = usePlayerSelector(
    (s) =>
      [
        s.current.id === track.id,
        s.current.id === track.id && s.playing,
        s.favorites.has(track.id),
      ] as const,
    tupleEqual,
  );

  return (
    <div className="group relative flex items-center gap-3 p-2 pr-2.5 rounded-2xl bg-white/[0.025] hover:bg-white/[0.05] ring-1 ring-white/[0.04] transition-colors animate-fade-in-up">
      {/* Tap target — instant playback + open player */}
      <button
        onPointerEnter={() => player.preload(track)}
        onTouchStart={() => player.preload(track)}
        onFocus={() => player.preload(track)}
        onClick={() => {
          if (isPlaying) {
            nav({ to: "/player" });
            return;
          }
          void player.play(track, { fadeIn: true });
          nav({ to: "/player" });
        }}
        className="flex items-center gap-3 flex-1 min-w-0 text-left tap"
        aria-label={`Open ${track.title}`}
      >
        <div
          className="relative h-12 w-12 rounded-xl shrink-0 grid place-items-center text-lg ring-1 ring-white/10 shadow-[0_4px_14px_rgba(0,0,0,0.35)]"
          style={{ background: track.gradient }}
        >
          <span className="opacity-90 select-none">{track.icon}</span>
          {isPlaying && (
            <span className="absolute -bottom-1 -right-1 flex items-end gap-[2px] h-3 px-1 rounded-full bg-black/60 ring-1 ring-white/15">
              <span className="w-[2px] bg-white/90 animate-bar-1" />
              <span className="w-[2px] bg-white/90 animate-bar-2" />
              <span className="w-[2px] bg-white/90 animate-bar-3" />
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`truncate text-[15px] tracking-tight ${isCurrent ? "text-foreground font-semibold" : "font-medium text-foreground/95"}`}>
            {track.title}
          </div>
          <div className="text-[12px] text-muted-foreground/80 truncate mt-0.5">
            {subtitle ?? track.artist}
          </div>
        </div>
      </button>

      {/* Favorite */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          player.toggleFav(track.id);
        }}
        aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        className="h-9 w-9 rounded-full grid place-items-center text-muted-foreground/70 hover:text-foreground tap"
      >
        <Heart className={`h-[18px] w-[18px] transition-all ${isFav ? "fill-rose-400 text-rose-400 scale-110" : ""}`} />
      </button>

      {/* Play / pause */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (isPlaying) {
            void player.toggle();
          } else {
            void player.play(track, { fadeIn: true });
          }
        }}
        aria-label={isPlaying ? "Pause" : "Play"}
        className="h-10 w-10 rounded-full bg-foreground text-background grid place-items-center shadow-[0_6px_18px_rgba(255,255,255,0.12)] tap transition-transform active:scale-95"
      >
        {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
      </button>
    </div>
  );
}
