import { useSyncExternalStore } from "react";

/**
 * White Noise Mixer
 * -----------------
 * Independent multi-track ambient mixer. Each sound has its own
 * HTMLAudioElement so multiple noises can layer freely (rain + train +
 * thunder, etc.) without touching the global single-track player.
 */

type MixerState = {
  active: Set<string>;
  /** Per-sound volume 0..1, defaults to 0.7. */
  volumes: Record<string, number>;
};

const elements = new Map<string, HTMLAudioElement>();
const listeners = new Set<() => void>();
const STORAGE_KEY = "sleepflow:noise-mixer:v1";

let state: MixerState = load();

function load(): MixerState {
  const base: MixerState = { active: new Set(), volumes: {} };
  if (typeof window === "undefined") return base;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const p = JSON.parse(raw);
    return {
      active: new Set(),
      volumes: p?.volumes && typeof p.volumes === "object" ? p.volumes : {},
    };
  } catch {
    return base;
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ volumes: state.volumes }));
  } catch {}
}

function emit() {
  listeners.forEach((l) => l());
}

function getEl(id: string, url: string): HTMLAudioElement {
  let el = elements.get(id);
  if (!el) {
    el = new Audio(url);
    el.loop = true;
    el.preload = "auto";
    el.crossOrigin = "anonymous";
    (el as HTMLAudioElement & { playsInline?: boolean }).playsInline = true;
    el.setAttribute("playsinline", "");
    el.volume = state.volumes[id] ?? 0.7;
    elements.set(id, el);
  }
  return el;
}

export const noiseMixer = {
  isActive(id: string) {
    return state.active.has(id);
  },
  async toggle(id: string, url: string) {
    if (state.active.has(id)) {
      const el = elements.get(id);
      el?.pause();
      // White-noise restart-on-replay rule: always rewind to 00:00 on pause
      // so the next play() starts fresh from the beginning.
      if (el) { try { el.currentTime = 0; } catch {} }
      const next = new Set(state.active);
      next.delete(id);
      state = { ...state, active: next };
      emit();
      return;
    }
    const el = getEl(id, url);
    // Always restart noise loops from the beginning.
    try { el.currentTime = 0; } catch {}
    try {
      await el.play();
      const next = new Set(state.active);
      next.add(id);
      state = { ...state, active: next };
      emit();
    } catch {
      // play() can reject if user gesture context is lost — silently ignore.
    }
  },
  stopAll() {
    elements.forEach((el) => el.pause());
    state = { ...state, active: new Set() };
    emit();
  },
  setVolume(id: string, v: number) {
    const vol = Math.max(0, Math.min(1, v));
    state = { ...state, volumes: { ...state.volumes, [id]: vol } };
    const el = elements.get(id);
    if (el) el.volume = vol;
    persist();
    emit();
  },
  getVolume(id: string) {
    return state.volumes[id] ?? 0.7;
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get() {
    return state;
  },
};

export function useNoiseMixer(): MixerState {
  return useSyncExternalStore(
    noiseMixer.subscribe,
    noiseMixer.get,
    () => ({ active: new Set<string>(), volumes: {} }),
  );
}
