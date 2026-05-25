import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, Check, Sparkles } from "lucide-react";
import {
  sleepProfile,
  recommendation,
  type SleepType,
  type SoundType,
  type SleepQuality,
  type FallAsleepTime,
  type WakeNight,
  type SleepPosition,
  type SleepImpact,
  type BadHabit,
} from "@/lib/sleep-profile";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Welcome — SleepFlow" }] }),
  component: Onboarding,
});

type Answers = {
  hours?: number;
  quality?: SleepQuality;
  position?: SleepPosition;
  fallAsleep?: FallAsleepTime;
  wakeNight?: WakeNight;
  impact?: SleepImpact;
  habits?: BadHabit[];
  bedtime?: string;
  sleepType?: SleepType;
  sound?: SoundType;
};

type Option<V> = { value: V; labelKey: string; icon?: string };

const HOURS_OPTS: Option<number>[] = [
  { value: 5, labelKey: "ob.hours.lt6", icon: "🥱" },
  { value: 7, labelKey: "ob.hours.6to8", icon: "😌" },
  { value: 9, labelKey: "ob.hours.8to10", icon: "😄" },
  { value: 10, labelKey: "ob.hours.gt10", icon: "😴" },
];
const QUALITY_OPTS: Option<SleepQuality>[] = [
  { value: "poor", labelKey: "ob.quality.poor", icon: "😣" },
  { value: "ok", labelKey: "ob.quality.ok", icon: "😔" },
  { value: "good", labelKey: "ob.quality.good", icon: "🙂" },
  { value: "excellent", labelKey: "ob.quality.excellent", icon: "😁" },
];
const POSITION_OPTS: Option<SleepPosition>[] = [
  { value: "back", labelKey: "ob.pos.back", icon: "🛌" },
  { value: "side", labelKey: "ob.pos.side", icon: "↪️" },
  { value: "fetal", labelKey: "ob.pos.fetal", icon: "🤲" },
  { value: "stomach", labelKey: "ob.pos.stomach", icon: "⬇️" },
];
const FALL_OPTS: Option<FallAsleepTime>[] = [
  { value: "minutes", labelKey: "ob.fall.minutes", icon: "⏳" },
  { value: "15-30", labelKey: "ob.fall.1530", icon: "🕒" },
  { value: "30-45", labelKey: "ob.fall.3045", icon: "🕓" },
  { value: "trouble", labelKey: "ob.fall.trouble", icon: "🙇" },
];
const WAKE_OPTS: Option<WakeNight>[] = [
  { value: "rarely", labelKey: "ob.wake.rarely", icon: "😴" },
  { value: "sometimes", labelKey: "ob.wake.sometimes", icon: "😐" },
  { value: "often", labelKey: "ob.wake.often", icon: "😞" },
  { value: "most", labelKey: "ob.wake.most", icon: "😵" },
];
const IMPACT_OPTS: Option<SleepImpact>[] = [
  { value: "very", labelKey: "ob.impact.very", icon: "😩" },
  { value: "somewhat", labelKey: "ob.impact.somewhat", icon: "🙁" },
  { value: "a-little", labelKey: "ob.impact.little", icon: "😕" },
  { value: "not-at-all", labelKey: "ob.impact.none", icon: "🙂" },
];
const HABIT_OPTS: Option<BadHabit>[] = [
  { value: "screens", labelKey: "ob.habit.screens", icon: "📱" },
  { value: "caffeine", labelKey: "ob.habit.caffeine", icon: "☕" },
  { value: "late-meal", labelKey: "ob.habit.lateMeal", icon: "🍔" },
  { value: "late-exercise", labelKey: "ob.habit.lateExercise", icon: "🧘" },
  { value: "none", labelKey: "ob.habit.none", icon: "🙂" },
];
const BEDTIME_OPTS: Option<string>[] = [
  { value: "21:30", labelKey: "21:30" },
  { value: "22:00", labelKey: "22:00" },
  { value: "22:30", labelKey: "22:30" },
  { value: "23:00", labelKey: "23:00" },
  { value: "23:30", labelKey: "23:30" },
  { value: "00:00", labelKey: "00:00" },
];
const SLEEP_TYPE_OPTS: Option<SleepType>[] = [
  { value: "light", labelKey: "ob.type.light", icon: "🌬️" },
  { value: "heavy", labelKey: "ob.type.heavy", icon: "🪨" },
];
const SOUND_OPTS: Option<SoundType>[] = [
  { value: "rain", labelKey: "ob.sound.rain", icon: "🌧️" },
  { value: "ocean", labelKey: "ob.sound.ocean", icon: "🌊" },
  { value: "white-noise", labelKey: "ob.sound.whiteNoise", icon: "✨" },
];

function Onboarding() {
  const t = useT();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>({});

  const steps = useMemo(() => [
    { key: "hours", titleKey: "ob.q.hours", opts: HOURS_OPTS, multi: false },
    { key: "quality", titleKey: "ob.q.quality", opts: QUALITY_OPTS, multi: false },
    { key: "position", titleKey: "ob.q.position", opts: POSITION_OPTS, multi: false },
    { key: "fallAsleep", titleKey: "ob.q.fall", opts: FALL_OPTS, multi: false },
    { key: "wakeNight", titleKey: "ob.q.wake", opts: WAKE_OPTS, multi: false },
    { key: "impact", titleKey: "ob.q.impact", opts: IMPACT_OPTS, multi: false },
    { key: "habits", titleKey: "ob.q.habits", opts: HABIT_OPTS, multi: true },
    { key: "bedtime", titleKey: "ob.q.bedtime", opts: BEDTIME_OPTS, multi: false },
    { key: "sleepType", titleKey: "ob.q.type", opts: SLEEP_TYPE_OPTS, multi: false },
    { key: "sound", titleKey: "ob.q.sound", opts: SOUND_OPTS, multi: false },
  ] as const, []);

  const total = steps.length;
  const isResult = step === total;
  const current = steps[Math.min(step, total - 1)];
  const value = (a as any)[current.key];
  const valid = current.multi ? Array.isArray(value) && value.length > 0 : value !== undefined && value !== null;

  const select = (v: any) => {
    if (current.multi) {
      const arr: any[] = Array.isArray(value) ? [...value] : [];
      const i = arr.indexOf(v);
      if (i >= 0) arr.splice(i, 1); else arr.push(v);
      setA({ ...a, [current.key]: arr });
    } else {
      setA({ ...a, [current.key]: v });
    }
  };

  const buildRec = () =>
    recommendation({
      onboarded: false,
      hours: a.hours ?? 7,
      bedtime: a.bedtime ?? "23:00",
      sleepType: a.sleepType ?? "light",
      sound: a.sound ?? "rain",
      notifications: true,
      quality: a.quality,
      position: a.position,
      fallAsleep: a.fallAsleep,
      wakeNight: a.wakeNight,
      impact: a.impact,
      habits: a.habits,
    });

  const next = async () => {
    if (isResult) {
      const rec = buildRec();
      await sleepProfile.requestNotificationPermission();
      sleepProfile.complete({
        hours: rec.targetHours,
        bedtime: a.bedtime ?? rec.bedtime,
        sleepType: a.sleepType ?? "light",
        sound: rec.sound,
        quality: a.quality,
        position: a.position,
        fallAsleep: a.fallAsleep,
        wakeNight: a.wakeNight,
        impact: a.impact,
        habits: a.habits,
      });
      nav({ to: "/" });
      return;
    }
    if (!valid) return;
    if (step === total - 1) {
      setStep(total);
    } else {
      setStep(step + 1);
    }
  };

  const back = () => setStep(Math.max(0, step - 1));

  if (isResult) {
    const rec = buildRec();
    const soundOpt = SOUND_OPTS.find((s) => s.value === rec.sound);
    return (
      <div className="min-h-[calc(100vh-2rem)] flex flex-col animate-fade-in-up pb-6">
        <div className="flex-1 flex flex-col justify-center text-center space-y-6 py-6">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-brand/15 flex items-center justify-center">
            <Sparkles className="h-7 w-7 text-brand" />
          </div>
          <div>
            <p className="text-sm text-brand">{t("ob.result.kicker")}</p>
            <h2 className="text-2xl font-bold tracking-tight mt-1">{t("ob.result.title")}</h2>
          </div>

          <div className="rounded-2xl p-5 bg-gradient-to-br from-brand/15 to-brand/5 ring-1 ring-brand/20 text-left">
            <div className="text-[11px] uppercase tracking-[0.2em] text-brand/90">{t("ob.result.profile")}</div>
            <div className="mt-1.5 text-xl font-bold">{t(rec.classificationKey)}</div>
            <p className="mt-1 text-sm text-foreground/75 leading-relaxed">{t(rec.classificationDescKey)}</p>
          </div>

          <div className="space-y-2.5 text-left">
            <ResultRow label={t("ob.result.recSleep")} value={t("ob.result.recSleepValue", { h: rec.targetHours })} />
            <ResultRow label={t("ob.result.bedtime")} value={rec.bedtime} />
            <ResultRow label={t("ob.result.category")} value={t(`musiccat.${rec.category}`)} />
            <ResultRow label={t("ob.result.suggestSound")} value={soundOpt ? t(soundOpt.labelKey) : t("ob.sound.rain")} />
            <ResultRow label={t("ob.result.routine")} value={t(rec.routineKey)} />
            <ResultRow label={t("ob.result.tip")} value={t(rec.tipKey)} />
          </div>
        </div>
        <button
          onClick={next}
          className="mt-6 h-14 rounded-2xl bg-foreground text-background font-semibold tap flex items-center justify-center gap-2 shadow-lg"
        >
          {t("ob.result.cta")} <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-2rem)] flex flex-col animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={back}
          disabled={step === 0}
          className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground disabled:opacity-30 tap"
          aria-label={t("common.back")}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-foreground transition-all duration-300"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 space-y-7">
        <h2 className="text-2xl font-bold tracking-tight leading-snug text-center px-2">
          {t(current.titleKey)}
        </h2>

        <div className="space-y-2.5">
          {current.opts.map((o) => {
            const active = current.multi
              ? Array.isArray(value) && value.includes(o.value)
              : value === o.value;
            return (
              <button
                key={String(o.value)}
                onClick={() => select(o.value)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl border tap transition-colors ${
                  active ? "border-brand bg-brand/10" : "border-white/10 bg-surface"
                }`}
              >
                {o.icon && (
                  <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl shrink-0">
                    {o.icon}
                  </div>
                )}
                <span className="flex-1 text-left font-medium">
                  {current.key === "bedtime" ? o.labelKey : t(o.labelKey)}
                </span>
                {current.multi ? (
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${active ? "border-brand bg-brand" : "border-white/20"}`}>
                    {active && <Check className="h-3 w-3 text-background" />}
                  </div>
                ) : active ? (
                  <Check className="h-5 w-5 text-brand" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={next}
        disabled={!valid}
        className="mt-8 h-14 rounded-2xl bg-foreground text-background font-semibold tap flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:pointer-events-none"
      >
        {t("common.continue")} <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-2xl bg-surface border border-white/10">
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="font-semibold mt-1">{value}</div>
    </div>
  );
}
