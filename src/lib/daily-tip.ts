// Daily tip rotator. One tip per calendar day, no consecutive repeats.
// Each tip carries a "kind" so the UI can render interactive variants
// (breathing exercise, white-noise category link) instead of plain text.

export type TipKind = "text" | "breathing" | "whiteNoise";
export type TipDef = {
  /** 1-based id, used in i18n keys: daily.tip.{id}, daily.tip.{id}.detail */
  id: number;
  kind: TipKind;
};

export const TIPS: TipDef[] = [
  { id: 1, kind: "text" },
  { id: 2, kind: "text" },
  { id: 3, kind: "text" },
  { id: 4, kind: "text" },
  { id: 5, kind: "text" },
  { id: 6, kind: "text" },
  { id: 7, kind: "text" },
  { id: 8, kind: "text" },
  { id: 9, kind: "text" },
  { id: 10, kind: "text" },
  { id: 11, kind: "breathing" }, // 4-7-8 breathing exercise
  { id: 12, kind: "text" },
  { id: 13, kind: "text" },
  { id: 14, kind: "text" },
  { id: 15, kind: "whiteNoise" }, // white-noise category link
];

const KEY = "sleepflow:dailyTip:v2";

function dayIndex(): number {
  const d = new Date();
  const ms = d.getTime() - d.getTimezoneOffset() * 60000;
  return Math.floor(ms / 86400000);
}

type Stored = { day: number; idx: number; prev?: number };

function load(): Stored | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function save(s: Stored) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
}

export function todayTip(): TipDef {
  const day = dayIndex();
  const stored = load();
  if (stored && stored.day === day && stored.idx >= 0 && stored.idx < TIPS.length) {
    return TIPS[stored.idx];
  }
  const avoid = stored?.idx;
  let idx = Math.floor(Math.random() * TIPS.length);
  if (TIPS.length > 1 && avoid !== undefined && idx === avoid) {
    idx = (idx + 1) % TIPS.length;
  }
  save({ day, idx, prev: avoid });
  return TIPS[idx];
}

// Back-compat: previous API returned just the i18n key.
export function todayTipKey(): string {
  return `daily.tip.${todayTip().id}`;
}
