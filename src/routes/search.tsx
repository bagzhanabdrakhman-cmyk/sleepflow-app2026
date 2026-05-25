import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Search as SearchIcon } from "lucide-react";
import { useState, useMemo } from "react";
import { MoodCard } from "@/components/MoodCard";
import { TRACKS } from "@/lib/player-store";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Search — MoodBeats" }] }),
  component: SearchPage,
});

const TRENDING = ["Deep Sleep", "Rain Sounds", "Ocean Waves", "Forest Birds", "White Noise", "Meditation Music"];

function SearchPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => TRACKS.filter((t) => t.title.toLowerCase().includes(q.toLowerCase())),
    [q],
  );
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="text-3xl font-bold">Search</h1>
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="What do you want to listen to?"
          className="w-full bg-surface rounded-2xl pl-11 pr-4 py-3.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      {q === "" ? (
        <>
          <section>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-brand" />
              <h2 className="text-lg font-bold">Trending Searches</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING.map((t) => (
                <button
                  key={t}
                  onClick={() => setQ(t)}
                  className="bg-surface px-4 py-2 rounded-full text-sm tap"
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">Browse All</h2>
            <div className="grid grid-cols-2 gap-3">
              {TRACKS.map((t) => (
                <MoodCard key={t.id} track={t} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.length === 0 ? (
            <p className="col-span-2 text-center text-muted-foreground py-12">No results</p>
          ) : (
            filtered.map((t) => <MoodCard key={t.id} track={t} />)
          )}
        </div>
      )}
    </div>
  );
}
