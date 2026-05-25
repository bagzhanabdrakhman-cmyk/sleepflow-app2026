import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { MoodCard } from "@/components/MoodCard";
import { usePlayer, TRACKS } from "@/lib/player-store";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/favorites")({
  head: () => ({ meta: [{ title: "Favorites — MoodBeats" }] }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const t = useT();
  const s = usePlayer();
  const favs = TRACKS.filter((tr) => s.favorites.has(tr.id));
  return (
    <div className="space-y-6 animate-fade-in-up">
      <header>
        <div className="flex items-center gap-2">
          <Heart className="h-7 w-7 fill-[oklch(0.65_0.25_25)] text-[oklch(0.65_0.25_25)]" />
          <h1 className="text-3xl font-bold">{t("favorites.title")}</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{t("favorites.count", { n: favs.length })}</p>
      </header>

      {favs.length === 0 ? (
        <div className="flex flex-col items-center text-center py-20 px-6">
          <div className="h-20 w-20 rounded-full bg-surface flex items-center justify-center mb-4">
            <Heart className="h-9 w-9 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold">{t("favorites.emptyTitle")}</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {t("favorites.emptyHint")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {favs.map((tr) => (
            <MoodCard key={tr.id} track={tr} />
          ))}
        </div>
      )}
    </div>
  );
}

