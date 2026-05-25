import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon, Play, Wind, CalendarClock, Sparkles, Baby, ChevronRight } from "lucide-react";
import { useSleepProfile } from "@/lib/sleep-profile";
import { player, tracksByCategory, type Track } from "@/lib/player-store";
import { useT } from "@/lib/i18n";
import { TipCard } from "@/components/TipCard";
import { WhiteNoiseGrid } from "@/components/WhiteNoiseGrid";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SleepFlow — Sleep better tonight" },
      {
        name: "description",
        content: "Personalized ambient sleep sounds, bedtime reminders, and gentle guidance.",
      },
    ],
  }),
  component: Home,
});

function greetingKey() {
  const h = new Date().getHours();
  if (h < 5) return "greet.night";
  if (h < 12) return "greet.morning";
  if (h < 18) return "greet.afternoon";
  return "greet.evening";
}

function minutesUntil(bedtime: string, label: string, minLabel: string): string | null {
  if (!bedtime) return null;
  const [bh, bm] = bedtime.split(":").map(Number);
  if (Number.isNaN(bh) || Number.isNaN(bm)) return null;
  const now = new Date();
  const target = new Date();
  target.setHours(bh, bm, 0, 0);
  let diff = target.getTime() - now.getTime();
  if (diff < 0) diff += 24 * 60 * 60 * 1000;
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${label} ${mins} ${minLabel}`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${label} ${h}h ${m}m` : `${label} ${h}h`;
}

function Home() {
  const t = useT();
  const profile = useSleepProfile();
  const nav = useNavigate();
  const [greet, setGreet] = useState("");
  const [until, setUntil] = useState<string | null>(null);

  useEffect(() => {
    setGreet(t(greetingKey()));
  }, [t]);

  useEffect(() => {
    if (!profile.onboarded) nav({ to: "/onboarding" });
  }, [profile.onboarded, nav]);

  useEffect(() => {
    if (!profile.bedtime) return;
    const inLabel = t("common.in");
    const minLabel = t("common.min");
    setUntil(minutesUntil(profile.bedtime, inLabel, minLabel));
    const id = setInterval(() => setUntil(minutesUntil(profile.bedtime, inLabel, minLabel)), 60000);
    return () => clearInterval(id);
  }, [profile.bedtime, t]);

  if (!profile.onboarded) return null;

  const sleepTracks = tracksByCategory("sleep");

  const startSleep = () => {
    if (sleepTracks[0]) void player.play(sleepTracks[0]);
    nav({ to: "/player" });
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex items-center justify-between pt-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground/70 min-h-[1em]">
            {greet}
          </p>
          <h1 className="mt-1 text-[28px] font-semibold tracking-tight">SleepFlow</h1>
        </div>
      </header>

      {/* Hero — moonlit night sky */}
      <button
        onClick={startSleep}
        aria-label={t("home.startSleep")}
        className="group relative w-full rounded-[28px] overflow-hidden tap ring-1 ring-white/10 shadow-[var(--shadow-card)]"
        style={{
          background: "linear-gradient(180deg,#05060f 0%,#0b1030 40%,#1a1747 75%,#2a1a55 100%)",
        }}
      >
        {/* Starfield */}
        <div className="absolute inset-0 starfield opacity-90" />
        {/* Warm crescent moon glow */}
        <div
          className="pointer-events-none absolute -top-10 -right-8 h-56 w-56 rounded-full opacity-80"
          style={{
            background:
              "radial-gradient(circle, rgba(255,209,102,0.55), rgba(255,170,60,0.18) 45%, transparent 70%)",
          }}
        />
        {/* Clean glowing crescent moon */}
        <svg
          aria-hidden="true"
          viewBox="0 0 96 96"
          className="pointer-events-none absolute top-4 right-5 h-24 w-24 select-none drop-shadow-[0_0_28px_rgba(255,196,90,0.42)]"
        >
          <defs>
            <radialGradient id="sleepflowMoonFill" cx="35%" cy="32%" r="72%">
              <stop offset="0%" stopColor="#fff3b6" />
              <stop offset="58%" stopColor="#ffd66b" />
              <stop offset="100%" stopColor="#f6b84c" />
            </radialGradient>
            <filter id="sleepflowMoonSoftGlow" x="-45%" y="-45%" width="190%" height="190%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 1  0 0.82 0 0 0.66  0 0 0.35 0 0.2  0 0 0 0.55 0"
              />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M61.8 13.4C45.3 17.2 32.9 32 32.9 49.7c0 17.9 12.7 32.8 29.5 36.4C50.1 91.8 35 89.2 23.2 80.2 10.6 70.7 4.6 54.9 7.7 39.4 10.8 23.7 22.7 11.2 38.2 7.3c8.6-2.2 17-0.6 23.6 6.1Z"
            fill="url(#sleepflowMoonFill)"
            filter="url(#sleepflowMoonSoftGlow)"
          />
          <path
            d="M28.5 57.8c3.7 4.2 9.6 4.2 13.2 0"
            fill="none"
            stroke="#8b5a16"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
        {/* Cloud wisp at base */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-[radial-gradient(ellipse_at_30%_120%,rgba(30,41,80,0.9),transparent_70%),radial-gradient(ellipse_at_75%_130%,rgba(20,25,55,0.85),transparent_70%)]" />

        <div className="relative px-6 pt-7 pb-6 flex flex-col gap-10">
          <div className="flex items-start justify-between">
            <div className="text-left max-w-[58%]">
              <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-white/65">
                <Moon className="h-3 w-3" /> {t("home.tonight")}
              </div>
              <div className="mt-2 text-2xl font-semibold tracking-tight text-white leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                {t("home.driftLine1")}
                <br />
                {t("home.driftLine2")}
              </div>
            </div>
            <div className="text-right pt-24">
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/55">
                {t("home.bedtime")}
              </div>
              <div className="mt-1 text-lg font-semibold text-white tabular-nums">
                {profile.bedtime}
              </div>
              {until && <div className="text-[11px] text-white/65 mt-0.5">{until}</div>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] text-white/55">{t("home.recommended")}</div>
              <div className="text-white/90 text-sm">
                <span className="font-semibold">{profile.hours}h</span> · {sleepTracks.length}{" "}
                {sleepTracks.length === 1 ? t("home.sound") : t("home.sounds")}
              </div>
            </div>
            <div className="h-14 w-14 rounded-full bg-white text-black grid place-items-center shadow-[0_8px_30px_rgba(255,255,255,0.25)] group-active:scale-95 transition-transform">
              <Play className="h-6 w-6 fill-current ml-0.5" />
            </div>
          </div>
        </div>
      </button>

      {/* Quick tools */}
      <section className="grid grid-cols-4 gap-2.5">
        <Link
          to="/schedule"
          className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-surface ring-1 ring-white/5 tap"
        >
          <CalendarClock className="h-5 w-5 text-brand" />
          <span className="text-[10px] text-muted-foreground">{t("home.tools.schedule")}</span>
        </Link>
        <Link
          to="/sleep"
          className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-surface ring-1 ring-white/5 tap"
        >
          <Wind className="h-5 w-5 text-brand" />
          <span className="text-[10px] text-muted-foreground">{t("home.tools.sounds")}</span>
        </Link>
        <Link
          to="/profile"
          className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-surface ring-1 ring-white/5 tap"
        >
          <Sparkles className="h-5 w-5 text-brand" />
          <span className="text-[10px] text-muted-foreground">{t("home.tools.tip")}</span>
        </Link>
        <Link
          to="/baby"
          className="flex flex-col items-center gap-2 py-4 rounded-2xl ring-1 ring-pink-200/20 tap"
          style={{
            background: "linear-gradient(135deg,rgba(252,231,243,0.10),rgba(191,219,254,0.08))",
          }}
        >
          <Baby className="h-5 w-5 text-pink-300" />
          <span className="text-[10px] text-foreground/85">{t("home.tools.baby")}</span>
        </Link>
      </section>

      {/* Premium tip card */}
      <TipCard />


      {/* Sleep music rail */}
      <CategoryRail
        title="Музыка для сна"
        href="/sleep"
        items={sleepTracks}
      />

      {/* Baby Sleep rail */}
      <CategoryRail
        title="Baby Sleep"
        href="/baby"
        items={tracksByCategory("baby")}
      />

      {/* Nature rail */}
      <CategoryRail
        title="Природа"
        items={tracksByCategory("nature")}
      />

      {/* White Noise */}
      <section>
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-[15px] font-semibold tracking-tight">Белый шум</h2>
          <Link to="/white-noise" className="text-xs text-brand tap font-medium inline-flex items-center gap-0.5">
            Посмотреть все <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <WhiteNoiseGrid variant="scroll" />
      </section>
    </div>
  );
}

function CategoryRail({
  title,
  href,
  items,
  large = false,
}: {
  title: string;
  href?: string;
  items: Track[];
  large?: boolean;
}) {
  if (!items.length) return null;
  return (
    <section>
      <div className="flex items-end justify-between mb-3">
        <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
        {href && (
          <Link to={href} className="text-xs text-brand tap font-medium inline-flex items-center gap-0.5">
            View all <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto -mx-4 px-4 pb-2 snap-x snap-mandatory scrollbar-none">
        {items.map((tr) => (
          <RailCard key={tr.id} track={tr} large={large} />
        ))}
      </div>
    </section>
  );
}

function RailCard({ track, large }: { track: Track; large?: boolean }) {
  const size = large ? "w-44" : "w-36";
  const aspect = large ? "h-44" : "h-36";
  return (
    <button
      onClick={() => void player.play(track)}
      className={`group relative ${size} shrink-0 snap-start text-left tap`}
    >
      <div
        className={`relative ${aspect} w-full rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-[var(--shadow-card)] flex items-center justify-center text-5xl`}
        style={{ background: track.gradient }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
        <span className="relative drop-shadow-lg">{track.icon}</span>
        <div className="absolute bottom-2 right-2 h-9 w-9 rounded-full bg-white text-black grid place-items-center shadow-lg opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
          <Play className="h-4 w-4 fill-current ml-0.5" />
        </div>
      </div>
      <div className="mt-2 px-0.5">
        <div className="text-[13px] font-semibold truncate">{track.title}</div>
        <div className="text-[11px] text-muted-foreground truncate">{track.artist}</div>
      </div>
    </button>
  );
}
