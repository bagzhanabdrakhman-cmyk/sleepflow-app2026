import { Play, ListMusic } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Playlist } from "@/lib/player-store";
import { player, TRACKS } from "@/lib/player-store";

export function PlaylistRow({ pl }: { pl: Playlist }) {
  const isSleep = pl.id === "deep-sleep";
  const inner = (
    <>
      <div
        className="relative h-14 w-14 rounded-xl shrink-0 flex items-center justify-center shadow-md ring-1 ring-white/10"
        style={{ background: pl.gradient }}
      >
        <ListMusic className="h-5 w-5 text-white/90 drop-shadow" />
      </div>
      <div className="flex-1 text-left min-w-0">
        <div className="font-semibold truncate tracking-tight">{pl.title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{pl.count} tracks · Playlist</div>
      </div>
      <div className="h-10 w-10 rounded-full bg-foreground text-background flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
        <Play className="h-4 w-4 fill-current ml-0.5" />
      </div>
    </>
  );

  const cls =
    "group w-full flex items-center gap-3 p-2.5 rounded-2xl bg-surface hover:bg-surface-elevated tap animate-fade-in-up border border-white/5";

  if (isSleep) {
    return (
      <Link to="/sleep" className={cls}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      onClick={() => {
        const seed = TRACKS.find((t) => pl.id.includes(t.id)) || TRACKS[Math.floor(Math.random() * TRACKS.length)];
        player.play(seed);
      }}
      className={cls}
    >
      {inner}
    </button>
  );
}
