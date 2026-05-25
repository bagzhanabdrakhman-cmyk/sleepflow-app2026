import { useSyncExternalStore } from "react";

export type SleepType = "light" | "heavy";
export type SoundType = "rain" | "ocean" | "white-noise";
export type SleepQuality = "poor" | "ok" | "good" | "excellent";
export type FallAsleepTime = "minutes" | "15-30" | "30-45" | "trouble";
export type WakeNight = "rarely" | "sometimes" | "often" | "most";
export type SleepPosition = "back" | "side" | "fetal" | "stomach";
export type SleepImpact = "very" | "somewhat" | "a-little" | "not-at-all";
export type BadHabit = "screens" | "caffeine" | "late-meal" | "late-exercise" | "none";

export type SleepProfile = {
  onboarded: boolean;
  hours: number;
  bedtime: string;
  sleepType: SleepType;
  sound: SoundType;
  notifications: boolean;
  // extended
  quality?: SleepQuality;
  position?: SleepPosition;
  fallAsleep?: FallAsleepTime;
  wakeNight?: WakeNight;
  impact?: SleepImpact;
  habits?: BadHabit[];
};

const KEY = "sleepflow:profile:v2";

const DEFAULT: SleepProfile = {
  onboarded: false,
  hours: 7,
  bedtime: "23:00",
  sleepType: "light",
  sound: "rain",
  notifications: true,
};

function load(): SleepProfile {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT;
}

let state: SleepProfile = load();
const listeners = new Set<() => void>();

function emit() {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(state));
  }
  listeners.forEach((l) => l());
  scheduleNotifications();
}

let timers: number[] = [];
function clearTimers() { timers.forEach((id) => clearTimeout(id)); timers = []; }

function nextOccurrence(hhmm: string): Date {
  const [h, m] = hhmm.split(":").map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 1);
  return target;
}

function notify(title: string, body: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try { new Notification(title, { body, silent: false }); } catch {}
}

function scheduleNotifications() {
  if (typeof window === "undefined") return;
  clearTimers();
  if (!state.onboarded || !state.notifications) return;
  const bed = nextOccurrence(state.bedtime);
  const wind = new Date(bed.getTime() - 30 * 60 * 1000);
  const now = Date.now();
  if (wind.getTime() > now) {
    timers.push(window.setTimeout(() => notify("Wind down", "Start winding down — bedtime in 30 minutes."), wind.getTime() - now));
  }
  if (bed.getTime() > now) {
    timers.push(window.setTimeout(() => notify("Time to sleep", "It's time to sleep. Sweet dreams."), bed.getTime() - now));
  }
}

export const sleepProfile = {
  get: () => state,
  subscribe: (l: () => void) => { listeners.add(l); return () => listeners.delete(l); },
  update: (patch: Partial<SleepProfile>) => { state = { ...state, ...patch }; emit(); },
  complete: (patch: Partial<SleepProfile>) => { state = { ...state, ...patch, onboarded: true }; emit(); },
  reset: () => { state = { ...DEFAULT }; emit(); },
  requestNotificationPermission: async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return "denied";
    if (Notification.permission === "granted") return "granted";
    if (Notification.permission === "denied") return "denied";
    try { return await Notification.requestPermission(); } catch { return "denied"; }
  },
};

export function useSleepProfile() {
  return useSyncExternalStore(
    (l) => sleepProfile.subscribe(l),
    () => state,
    () => state,
  );
}

export type SleepClassification = "light" | "normal" | "deep" | "stressed";
export type MusicCategory = "sleep" | "baby" | "relax";

export type Recommendation = {
  targetHours: number;
  bedtime: string;
  sound: SoundType;
  classification: SleepClassification;
  category: MusicCategory;
  tipKey: string;
  routineKey: string;
  classificationKey: string;
  classificationDescKey: string;
};

function suggestBedtime(targetHours: number, wakeHour = 7): string {
  // Target bedtime = wake - sleep - 15 min wind-down buffer.
  const total = targetHours * 60 + 15;
  let mins = wakeHour * 60 - total;
  mins = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function recommendation(p: SleepProfile): Recommendation {
  const stressed =
    p.impact === "very" ||
    p.wakeNight === "most" ||
    (p.quality === "poor" && p.fallAsleep === "trouble");
  const trouble = p.fallAsleep === "trouble" || p.fallAsleep === "30-45";
  const wakesOften = p.wakeNight === "often" || p.wakeNight === "most";

  // Recommended sleep duration
  let targetHours = p.hours;
  if (p.hours < 6) targetHours = 7;
  else if (p.hours < 7 && (stressed || trouble || wakesOften)) targetHours = 8;
  else if (trouble || wakesOften) targetHours = Math.min(9, p.hours + 1);

  // Classification (derived, independent from user-selected sleepType)
  const classification: SleepClassification = stressed
    ? "stressed"
    : p.sleepType === "light" || trouble || wakesOften
    ? "light"
    : p.quality === "excellent" || p.quality === "good"
    ? "deep"
    : "normal";

  // Recommended music category
  const category: MusicCategory =
    classification === "stressed" ? "relax" :
    trouble || p.sleepType === "light" ? "sleep" :
    p.sound === "white-noise" ? "sleep" :
    "sleep";

  // Recommended sound
  const sound: SoundType =
    classification === "stressed" ? "ocean" :
    trouble || wakesOften ? "white-noise" :
    p.sleepType === "light" ? "white-noise" :
    p.sound ?? "rain";

  const bedtime = suggestBedtime(targetHours);

  const tipKey =
    p.habits?.includes("screens") ? "tip.wakes" :
    p.habits?.includes("caffeine") ? "tip.caffeine" :
    trouble ? "tip.troubleFall" :
    targetHours > p.hours ? "tip.short" :
    targetHours < p.hours ? "tip.long" :
    "tip.default";

  const routineKey =
    classification === "stressed" ? "routine.stressed" :
    classification === "light" ? "routine.light" :
    classification === "deep" ? "routine.deep" :
    "routine.normal";

  const classificationKey = `sleeptype.${classification}`;
  const classificationDescKey = `sleeptype.${classification}.desc`;

  return { targetHours, bedtime, sound, classification, category, tipKey, routineKey, classificationKey, classificationDescKey };
}

if (typeof window !== "undefined") {
  setTimeout(scheduleNotifications, 0);
}
