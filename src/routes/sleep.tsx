import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Moon } from "lucide-react";

import { TRACKS } from "@/lib/player-store";
import { useT } from "@/lib/i18n";
import { TrackRow } from "@/components/TrackRow";

export const Route = createFileRoute("/sleep")({
  head: () => ({ meta: [{ title: "Sleep — MoodBeats" }] }),
  component: SleepPage,
});

function SleepPage() {
  const t = useT();
  const sleepTracks = TRACKS.filter((tr) => tr.category === "sleep");

  return (
    <div className="space-y-6 animate-fade-in-up">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground tap">
        <ArrowLeft className="h-4 w-4" /> {t("common.back")}
      </Link>

      <header
        className="relative h-44 rounded-3xl overflow-hidden p-5 flex flex-col justify-end ring-1 ring-white/10 shadow-[var(--shadow-card)]"
        style={{ background: "linear-gradient(135deg,#0f0f23,#3b1d6e,#7c3aed)" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.18),transparent_60%)]" />
        <Moon className="relative h-7 w-7 text-white/90 mb-1" />
        <h1 className="relative text-3xl font-bold text-white tracking-tight">{t("sleep.title")}</h1>
        <p className="relative text-sm text-white/75 mt-0.5">{t("sleep.subtitle", { n: sleepTracks.length })}</p>
      </header>

      <section className="space-y-1.5">
        {sleepTracks.map((tr) => (
          <TrackRow key={tr.id} track={tr} />
        ))}
      </section>
    </div>
  );
}
