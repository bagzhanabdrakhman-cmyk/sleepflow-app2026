import { createFileRoute } from "@tanstack/react-router";
import { Library as LibIcon, Clock, Plus } from "lucide-react";
import { PlaylistRow } from "@/components/PlaylistRow";
import { TrackRow } from "@/components/TrackRow";

import { usePlayer, TRACKS, PLAYLISTS } from "@/lib/player-store";

export const Route = createFileRoute("/library")({
  head: () => ({ meta: [{ title: "Library — MoodBeats" }] }),
  component: LibraryPage,
});

function timeAgo(t: number) {
  const m = Math.floor((Date.now() - t) / 60000);
  if (m < 60) return `${Math.max(1, m)} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h > 1 ? "s" : ""} ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "Yesterday" : `${d} days ago`;
}

function LibraryPage() {
  const s = usePlayer();
  const recents = s.recents
    .map((r) => ({ track: TRACKS.find((t) => t.id === r.id)!, at: r.at }))
    .filter((x) => x.track);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <header>
        <div className="flex items-center gap-2">
          <LibIcon className="h-7 w-7 text-brand" />
          <h1 className="text-3xl font-bold">Library</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Your collection</p>
      </header>

      <section>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-5 w-5 text-brand" />
          <h2 className="text-lg font-bold">Recently Played</h2>
        </div>
        {recents.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing yet — tap a sound to start.</p>
        ) : (
          <div className="space-y-1.5">
            {recents.map(({ track, at }) => (
              <TrackRow key={track.id} track={track} subtitle={timeAgo(at)} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">Your Playlists</h2>
        <div className="space-y-2">
          {PLAYLISTS.map((p) => (
            <PlaylistRow key={p.id} pl={p} />
          ))}
        </div>
      </section>

      <button className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-border bg-surface/50 tap text-muted-foreground hover:text-foreground">
        <Plus className="h-4 w-4" /> Create New Playlist
      </button>
    </div>
  );
}
