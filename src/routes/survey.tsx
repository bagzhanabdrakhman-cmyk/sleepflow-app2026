import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ClipboardList, RotateCcw } from "lucide-react";
import { useSleepProfile, sleepProfile } from "@/lib/sleep-profile";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/survey")({
  head: () => ({ meta: [{ title: "Survey & Profile — SleepFlow" }] }),
  component: SurveyPage,
});

function SurveyPage() {
  const t = useT();
  const p = useSleepProfile();
  const nav = useNavigate();

  const dash = t("survey.value.none");

  // Map sleep-profile values to the same i18n keys onboarding uses.
  const QUALITY_MAP: Record<string, string> = {
    poor: "ob.quality.poor", ok: "ob.quality.ok", good: "ob.quality.good", excellent: "ob.quality.excellent",
  };
  const POSITION_MAP: Record<string, string> = {
    back: "ob.pos.back", side: "ob.pos.side", fetal: "ob.pos.fetal", stomach: "ob.pos.stomach",
  };
  const FALL_MAP: Record<string, string> = {
    minutes: "ob.fall.minutes", "15-30": "ob.fall.1530", "30-45": "ob.fall.3045", trouble: "ob.fall.trouble",
  };
  const WAKE_MAP: Record<string, string> = {
    rarely: "ob.wake.rarely", sometimes: "ob.wake.sometimes", often: "ob.wake.often", most: "ob.wake.most",
  };
  const IMPACT_MAP: Record<string, string> = {
    very: "ob.impact.very", somewhat: "ob.impact.somewhat", "a-little": "ob.impact.little", "not-at-all": "ob.impact.none",
  };
  const HABIT_MAP: Record<string, string> = {
    screens: "ob.habit.screens", caffeine: "ob.habit.caffeine", "late-meal": "ob.habit.lateMeal",
    "late-exercise": "ob.habit.lateExercise", none: "ob.habit.none",
  };
  const TYPE_MAP: Record<string, string> = { light: "ob.type.light", heavy: "ob.type.heavy" };
  const SOUND_MAP: Record<string, string> = {
    rain: "ob.sound.rain", ocean: "ob.sound.ocean", "white-noise": "ob.sound.whiteNoise",
  };

  const lookup = (map: Record<string, string>, v?: string) => (v && map[v] ? t(map[v]) : dash);

  const retake = () => {
    sleepProfile.reset();
    nav({ to: "/onboarding" });
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-20">
      <Link to="/account" className="inline-flex items-center gap-1 text-sm text-muted-foreground tap">
        <ArrowLeft className="h-4 w-4" /> {t("common.back")}
      </Link>

      <header className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-2xl bg-brand/15 flex items-center justify-center">
          <ClipboardList className="h-6 w-6 text-brand" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{t("survey.title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("survey.subtitle")}</p>
        </div>
      </header>

      {!p.onboarded ? (
        <section className="rounded-3xl bg-surface ring-1 ring-white/5 p-6 text-center space-y-4">
          <p className="text-sm text-muted-foreground">{t("survey.empty")}</p>
          <Link
            to="/onboarding"
            className="inline-flex items-center justify-center h-12 px-6 rounded-2xl bg-foreground text-background font-semibold tap"
          >
            {t("survey.start")}
          </Link>
        </section>
      ) : (
        <>
          <Section title={t("survey.section.sleep")}>
            <Row label={t("survey.q.hours")} value={t("survey.value.hours", { h: p.hours })} />
            <Row label={t("survey.q.bedtime")} value={p.bedtime} />
            <Row label={t("survey.q.quality")} value={lookup(QUALITY_MAP, p.quality)} />
            <Row label={t("survey.q.position")} value={lookup(POSITION_MAP, p.position)} />
            <Row label={t("survey.q.fall")} value={lookup(FALL_MAP, p.fallAsleep)} />
            <Row label={t("survey.q.wake")} value={lookup(WAKE_MAP, p.wakeNight)} />
            <Row label={t("survey.q.impact")} value={lookup(IMPACT_MAP, p.impact)} />
          </Section>

          <Section title={t("survey.section.habits")}>
            <Row
              label={t("survey.q.habits")}
              value={p.habits && p.habits.length ? p.habits.map((h) => t(HABIT_MAP[h] ?? h)).join(", ") : dash}
            />
          </Section>

          <Section title={t("survey.section.preferences")}>
            <Row label={t("survey.q.type")} value={lookup(TYPE_MAP, p.sleepType)} />
            <Row label={t("survey.q.sound")} value={lookup(SOUND_MAP, p.sound)} />
          </Section>

          <button
            onClick={retake}
            className="w-full h-12 rounded-2xl bg-surface ring-1 ring-white/5 text-sm font-medium tap inline-flex items-center justify-center gap-2 text-muted-foreground"
          >
            <RotateCcw className="h-4 w-4" />
            {t("survey.retake")}
          </button>
        </>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">{title}</h2>
      <div className="rounded-2xl bg-surface ring-1 ring-white/5 divide-y divide-white/5 overflow-hidden">
        {children}
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold text-right max-w-[60%] truncate">{value}</div>
    </div>
  );
}

// Habit prefix used by fmtList — map keys differ from values, so override here.
// (HABIT_MAP above is used for single-habit display; for the list we map manually.)
