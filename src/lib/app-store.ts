// Central global app state — single source of truth for UI preferences.
// Holds: language, theme, favorites, downloads, recent languages, AI translation cache.
// Persisted to localStorage under one key.

import { useSyncExternalStore } from "react";
import { ALL_LANGUAGES } from "@/i18n/languages";

// Lang is a free-form BCP-47 short code (e.g. "en", "pt-BR"). Hundreds of
// locales are supported via on-demand AI translations.
export type Lang = string;
export type Theme = "dark" | "light" | "minimal";

// SUPPORTED_LANGS now lists every locale the picker exposes.
export const SUPPORTED_LANGS: Lang[] = ALL_LANGUAGES.map((l) => l.code);
const FALLBACK_LANG: Lang = "en";

export type AppState = {
  lang: Lang;
  theme: Theme;
  favorites: Set<string>;
  downloads: Set<string>;
  recentLangs: Lang[]; // most-recent first, max 5
  // AI-generated translation cache: { [locale]: { [key]: value } }.
  // English ("en") and Russian ("ru") are baked into i18n.ts and never live here.
  translations: Record<string, Record<string, string>>;
  // Sleep preferences
  fadeIn: boolean; // gentle volume ramp when starting playback
  autoplayNext: boolean; // continue to next track on end
  // AI features
  autoTranslate: boolean; // generate AI translations for unsupported locales
};

const KEY = "sleepflow:app:v2";
const LEGACY = {
  v1: "sleepflow:app:v1",
  lang: "sleepflow:lang",
  theme: "moodbeats:theme",
  player: "moodbeats:v3",
};

const SUPPORTED_SET = new Set(SUPPORTED_LANGS);

function detectLang(): Lang {
  if (typeof navigator === "undefined") return FALLBACK_LANG;
  const langs = [navigator.language, ...(navigator.languages ?? [])];
  for (const raw of langs) {
    if (!raw) continue;
    const lower = raw.toLowerCase();
    if (SUPPORTED_SET.has(lower)) return lower;
    const short = lower.split("-")[0];
    if (SUPPORTED_SET.has(short)) return short;
  }
  return FALLBACK_LANG;
}

function applyTheme(t: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("theme-light", "theme-minimal", "theme-dark");
  root.classList.add(`theme-${t}`);
}
function applyLang(l: Lang) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("lang", l);
}

function load(): AppState {
  const base: AppState = {
    lang: FALLBACK_LANG,
    theme: "dark",
    favorites: new Set(),
    downloads: new Set(),
    recentLangs: [],
    translations: {},
    fadeIn: true,
    autoplayNext: true,
    autoTranslate: true,
  };
  if (typeof window === "undefined") return base;
  try {
    const raw =
      localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY.v1);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        lang: typeof p.lang === "string" && p.lang ? p.lang : detectLang(),
        theme: (["dark", "light", "minimal"] as const).includes(p.theme) ? p.theme : "dark",
        favorites: new Set<string>(p.favorites ?? []),
        downloads: new Set<string>(p.downloads ?? []),
        recentLangs: Array.isArray(p.recentLangs) ? p.recentLangs.slice(0, 5) : [],
        translations: p.translations && typeof p.translations === "object" ? p.translations : {},
        fadeIn: typeof p.fadeIn === "boolean" ? p.fadeIn : true,
        autoplayNext: typeof p.autoplayNext === "boolean" ? p.autoplayNext : true,
        autoTranslate: typeof p.autoTranslate === "boolean" ? p.autoTranslate : true,
      };
    }
    const legacyLang = localStorage.getItem(LEGACY.lang) as Lang | null;
    const legacyTheme = localStorage.getItem(LEGACY.theme) as Theme | null;
    let legacyFavs: string[] = [];
    try {
      const pr = localStorage.getItem(LEGACY.player);
      if (pr) legacyFavs = JSON.parse(pr).favorites ?? [];
    } catch {}
    return {
      ...base,
      lang: legacyLang || detectLang(),
      theme:
        legacyTheme === "light" || legacyTheme === "minimal" || legacyTheme === "dark"
          ? legacyTheme
          : "dark",
      favorites: new Set(legacyFavs),
    };
  } catch {
    return { ...base, lang: detectLang() };
  }
}

let state: AppState = load();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        lang: state.lang,
        theme: state.theme,
        favorites: [...state.favorites],
        downloads: [...state.downloads],
        recentLangs: state.recentLangs,
        translations: state.translations,
        fadeIn: state.fadeIn,
        autoplayNext: state.autoplayNext,
        autoTranslate: state.autoTranslate,
      }),
    );
  } catch {}
}

function commit(next: AppState) {
  state = next;
  persist();
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") {
  applyTheme(state.theme);
  applyLang(state.lang);
  persist();
}

export const appStore = {
  get: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },

  setLang: (l: Lang) => {
    if (!l) l = FALLBACK_LANG;
    if (l === state.lang) return;
    applyLang(l);
    const recentLangs = [l, ...state.recentLangs.filter((x) => x !== l)].slice(0, 5);
    commit({ ...state, lang: l, recentLangs });
  },

  setTheme: (t: Theme) => {
    if (t === state.theme) return;
    applyTheme(t);
    commit({ ...state, theme: t });
  },

  toggleFavorite: (id: string) => {
    const f = new Set(state.favorites);
    if (f.has(id)) f.delete(id);
    else f.add(id);
    commit({ ...state, favorites: f });
  },
  isFavorite: (id: string) => state.favorites.has(id),

  toggleDownload: (id: string) => {
    const d = new Set(state.downloads);
    if (d.has(id)) d.delete(id);
    else d.add(id);
    commit({ ...state, downloads: d });
  },
  isDownloaded: (id: string) => state.downloads.has(id),

  setFadeIn: (v: boolean) => {
    if (state.fadeIn === v) return;
    commit({ ...state, fadeIn: v });
  },
  setAutoplayNext: (v: boolean) => {
    if (state.autoplayNext === v) return;
    commit({ ...state, autoplayNext: v });
  },
  setAutoTranslate: (v: boolean) => {
    if (state.autoTranslate === v) return;
    commit({ ...state, autoTranslate: v });
  },

  // Merge translations for a locale into the cache.
  mergeTranslations: (locale: string, entries: Record<string, string>) => {
    if (!locale || !entries) return;
    const prev = state.translations[locale] ?? {};
    const next = { ...prev, ...entries };
    commit({
      ...state,
      translations: { ...state.translations, [locale]: next },
    });
  },
};

export function useAppStore<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(
    appStore.subscribe,
    () => selector(state),
    () => selector(state),
  );
}

export function useAppState(): AppState {
  return useSyncExternalStore(
    appStore.subscribe,
    () => state,
    () => state,
  );
}
