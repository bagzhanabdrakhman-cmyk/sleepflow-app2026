import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Baby, Play, Pause } from "lucide-react";

import { tracksByCategory, player, usePlayer } from "@/lib/player-store";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/baby")({
  head: () => ({
    meta: [
      { title: "Baby Sleep — SleepFlow" },
      { name: "description", content: "Soft lullabies, gentle white noise and calming sounds for infants." },
    ],
  }),
  component: BabyPage,
});

function BabyPage() {
  const t = useT();
  const s = usePlayer();
  const nav = useNavigate();
  const tracks = tracksByCategory("baby");
  const playTrack = (id: string) => {
    const tr = tracks.find((t) => t.id === id);
    if (!tr) return;
    if (s.current.id === tr.id && s.playing) {
      void player.toggle();
    } else {
      void player.play(tr);
      nav({ to: "/player" });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground tap">
        <ArrowLeft className="h-4 w-4" /> {t("common.back")}
      </Link>

      <header
        className="relative h-44 rounded-3xl overflow-hidden p-5 flex flex-col justify-end ring-1 ring-white/20 shadow-[var(--shadow-card)]"
        style={{ background: "linear-gradient(135deg,#fce7f3 0%,#e0e7ff 50%,#bfdbfe 100%)" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.55),transparent_60%)]" />
        <Baby className="relative h-7 w-7 text-slate-700 mb-1" />
        <h1 className="relative text-3xl font-bold text-slate-900 tracking-tight">{t("baby.title")}</h1>
        <p className="relative text-sm text-slate-700/85 mt-0.5">{t("baby.subtitle", { n: tracks.length })}</p>
      </header>

      <button
        onClick={() => {
          if (tracks.length) {
            void player.play(tracks[0]);
            nav({ to: "/player" });
          }
        }}
        className="w-full flex items-center justify-between rounded-2xl px-5 py-4 ring-1 ring-white/10 bg-surface tap"
      >
        <div className="text-left">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/80">{t("baby.oneTap")}</div>
          <div className="mt-0.5 text-[15px] font-semibold">{t("baby.playAll")}</div>
        </div>
        <div className="h-11 w-11 rounded-full bg-foreground text-background grid place-items-center">
          <Play className="h-4 w-4 fill-current ml-0.5" />
        </div>
      </button>

      <section className="space-y-2">
        {tracks.map((tr) => {
          const isCurrent = s.current.id === tr.id;
          const isPlaying = isCurrent && s.playing;
          return (
            <div key={tr.id} className="flex items-center gap-3 p-2.5 rounded-2xl bg-surface border border-white/5">
              <button
                onClick={() => playTrack(tr.id)}
                className="h-12 w-12 rounded-xl shrink-0 flex items-center justify-center text-xl ring-1 ring-white/20 tap"
                style={{ background: tr.gradient }}
                aria-label={`${t("common.play")} ${tr.title}`}
              >
                {tr.icon}
              </button>
              <button onClick={() => playTrack(tr.id)} className="flex-1 text-left min-w-0 tap">
                <div className="font-semibold truncate">{tr.title}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {isCurrent ? t("sleep.nowPlaying") : tr.artist}
                </div>
              </button>
              <button
                onClick={() => playTrack(tr.id)}
                className="h-9 w-9 rounded-full bg-foreground text-background flex items-center justify-center tap"
                aria-label={isPlaying ? t("common.pause") : t("common.play")}
              >
                {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
              </button>
            </div>
          );
        })}
      </section>

      <p className="text-[11px] text-muted-foreground/70 text-center px-6">{t("baby.autoplayHint")}</p>
    </div>
  );
}
