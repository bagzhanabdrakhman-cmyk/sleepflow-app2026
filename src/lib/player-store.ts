import { useSyncExternalStore } from "react";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/with-selector";
import { appStore } from "./app-store";
export type TrackCategory = "sleep" | "baby" | "fishing" | "nature" | "focus" | "ambient" | "noise";

export type Track = {
  id: string;
  title: string;
  artist: string;
  gradient: string;
  icon?: string;
  url?: string;
  category?: TrackCategory;
};

// Free CORS-enabled demo MP3s from SoundHelix.
const SH = (n: number) => `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`;

// Sleep tracks (uploaded, served from /public/audio).
const SLEEP_TRACKS: Track[] = [
  {
    id: "sleep-healing",
    title: "Sleep Healing",
    artist: "Leberch",
    gradient: "linear-gradient(135deg,#0f172a,#3b1d6e,#7c3aed)",
    icon: "🌙",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/sleep-healing.mp3",
    category: "sleep",
  },
  {
    id: "sleep-vol17",
    title: "Relaxing Time Vol. 17",
    artist: "RelaxingTime",
    gradient: "linear-gradient(135deg,#1a1a2e,#5a3a6e,#a78bfa)",
    icon: "💤",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/sleep-vol17.mp3",
    category: "sleep",
  },

  {
    id: "sleep-lullaby",
    title: "Lullaby Baby Sleep",
    artist: "BackgroundMusicForVideos",
    gradient: "linear-gradient(135deg,#1e1b4b,#6366f1,#a5b4fc)",
    icon: "🎶",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/sleep-lullaby.mp3",
    category: "sleep",
  },
  {
    id: "sleep-moonlight",
    title: "Moonlight Lullaby",
    artist: "PazuzuStudio",
    gradient: "linear-gradient(135deg,#020617,#1e3a8a,#60a5fa)",
    icon: "🌌",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/sleep-moonlight.mp3",
    category: "sleep",
  },
  {
    id: "sleep-armonica",
    title: "Sleep",
    artist: "Armonicamente",
    gradient: "linear-gradient(135deg,#0f0f23,#312e81,#818cf8)",
    icon: "🌠",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/sleep-armonica.mp3",
    category: "sleep",
  },
  {
    id: "sleep-mel-cradle-brains",
    title: "Колыбель для мозгов",
    artist: "Melancholic Sleep",
    gradient: "linear-gradient(135deg,#0b1026,#1e1b4b,#4338ca)",
    icon: "🌙",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/sleep-mel-cradle-brains.mp3",
    category: "sleep",
  },
  {
    id: "sleep-mel-thin-lines",
    title: "Тонкие линии звуковых волн",
    artist: "Melancholic Sleep",
    gradient: "linear-gradient(135deg,#0a0f1f,#1e293b,#64748b)",
    icon: "🌊",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/sleep-mel-thin-lines.mp3",
    category: "sleep",
  },
  {
    id: "sleep-mel-adult-lullaby",
    title: "Колыбельная для взрослых",
    artist: "Melancholic Sleep",
    gradient: "linear-gradient(135deg,#0f0a1f,#3b1d6e,#8b5cf6)",
    icon: "💜",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/sleep-mel-adult-lullaby.mp3",
    category: "sleep",
  },
  {
    id: "sleep-mel-close-eyes",
    title: "Закрой глаза, расслабь всё тело",
    artist: "Melancholic Sleep",
    gradient: "linear-gradient(135deg,#0a0a1f,#312e81,#6366f1)",
    icon: "🌌",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/sleep-mel-close-eyes.mp3",
    category: "sleep",
  },
  {
    id: "sleep-mel-deep-dive",
    title: "Для погружения в глубокий сон",
    artist: "Melancholic Sleep",
    gradient: "linear-gradient(135deg,#020617,#1e3a8a,#3b82f6)",
    icon: "🌠",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/sleep-mel-deep-dive.mp3",
    category: "sleep",
  },
  {
    id: "sleep-mel-relax-with",
    title: "С ней можно расслабиться",
    artist: "Melancholic Sleep",
    gradient: "linear-gradient(135deg,#1a0f2e,#4c1d95,#a78bfa)",
    icon: "✨",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/sleep-mel-relax-with.mp3",
    category: "sleep",
  },
  {
    id: "sleep-mel-helps-fall",
    title: "Музыка, которая помогает заснуть",
    artist: "Melancholic Sleep",
    gradient: "linear-gradient(135deg,#0f0f23,#3730a3,#818cf8)",
    icon: "🎶",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/sleep-mel-helps-fall.mp3",
    category: "sleep",
  },
  {
    id: "sleep-mel-deep-sleep",
    title: "Музыка для крепкого сна",
    artist: "Melancholic Sleep",
    gradient: "linear-gradient(135deg,#050816,#1e1b4b,#4f46e5)",
    icon: "💤",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/sleep-mel-deep-sleep.mp3",
    category: "sleep",
  },
  {
    id: "sleep-mel-soothing-relax",
    title: "Убаюкивающая релакс-музыка",
    artist: "Melancholic Sleep",
    gradient: "linear-gradient(135deg,#0a0f1f,#3b1d6e,#a78bfa)",
    icon: "🌙",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/sleep-mel-soothing-relax.mp3",
    category: "sleep",
  },
  {
    id: "sleep-mel-adult-loop",
    title: "Помогает уснуть взрослому (зацикл.)",
    artist: "Melancholic Sleep",
    gradient: "linear-gradient(135deg,#020617,#312e81,#60a5fa)",
    icon: "♾️",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/sleep-mel-adult-loop.mp3",
    category: "sleep",
  },
  {
    id: "sleep-mel-pleasant-beautiful",
    title: "Приятная и красивая музыка для сна",
    artist: "Melancholic Sleep",
    gradient: "linear-gradient(135deg,#0f0a1f,#4c1d95,#c4b5fd)",
    icon: "🌸",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/sleep-mel-pleasant-beautiful.mp3",
    category: "sleep",
  },
  {
    id: "sleep-mel-melancholic",
    title: "Меланхоличная музыка для сна",
    artist: "Melancholic Sleep",
    gradient: "linear-gradient(135deg,#050816,#1e1b4b,#7c3aed)",
    icon: "🩵",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/sleep-mel-melancholic.mp3",
    category: "sleep",
  },
  {
    id: "sleep-mel-listen-before",
    title: "Послушайте эту музыку перед сном",
    artist: "Melancholic Sleep",
    gradient: "linear-gradient(135deg,#0a0f1f,#312e81,#a78bfa)",
    icon: "🎧",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/sleep-mel-listen-before.mp3",
    category: "sleep",
  },
  {
    id: "sleep-mel-nature-music",
    title: "Звуки природы и музыка для сна",
    artist: "Melancholic Sleep",
    gradient: "linear-gradient(135deg,#052e1a,#1e3a8a,#60a5fa)",
    icon: "🌿",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/sleep-mel-nature-music.mp3",
    category: "sleep",
  },
  {
    id: "sleep-mel-slow-music",
    title: "Медленная музыка для сна",
    artist: "Melancholic Sleep",
    gradient: "linear-gradient(135deg,#0a0a1f,#3730a3,#818cf8)",
    icon: "🕯️",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/sleep-mel-slow-music.mp3",
    category: "sleep",
  },
  {
    id: "sleep-mel-ambient-drift",
    title: "Ambient Drift",
    artist: "Melancholic Sleep",
    gradient: "linear-gradient(135deg,#020617,#1e293b,#475569)",
    icon: "🌫️",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/sleep-mel-ambient-drift.mp3",
    category: "sleep",
  },
  {
    id: "sleep-mel-surf",
    title: "Шум прибоя, чтобы заснуть",
    artist: "Melancholic Sleep",
    gradient: "linear-gradient(135deg,#0c4a6e,#0e7490,#67e8f9)",
    icon: "🌊",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/sleep-mel-surf.mp3",
    category: "sleep",
  },
  {
    id: "sleep-mel-light-adults",
    title: "Лёгкая музыка для взрослых",
    artist: "Melancholic Sleep",
    gradient: "linear-gradient(135deg,#1a1a2e,#3b1d6e,#a5b4fc)",
    icon: "☁️",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/sleep-mel-light-adults.mp3",
    category: "sleep",
  },
  {
    id: "sleep-mel-inner-dive",
    title: "Внутреннее погружение",
    artist: "Melancholic Sleep",
    gradient: "linear-gradient(135deg,#0a0f1f,#312e81,#6366f1)",
    icon: "🌀",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/sleep-mel-inner-dive.mp3",
    category: "sleep",
  },
  {
    id: "sleep-mel-soulful",
    title: "Душевная музыка для сна",
    artist: "Melancholic Sleep",
    gradient: "linear-gradient(135deg,#1f0a2e,#5b21b6,#c4b5fd)",
    icon: "💜",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/sleep-mel-soulful.mp3",
    category: "sleep",
  },
];

const RAW_TRACKS: Track[] = [
  {
    id: "ocean",
    title: "Ocean",
    artist: "Ambient Sounds",
    gradient: "linear-gradient(135deg,#1e3a5f,#5fa8d3,#bde0fe)",
    icon: "🌊",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/ocean.mp3",
    category: "nature",
  },
  {
    id: "rain",
    title: "Rain",
    artist: "Nature Sounds",
    gradient: "linear-gradient(135deg,#1f2937,#4b5563,#9ca3af)",
    icon: "🌧️",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/rain.mp3",
    category: "nature",
  },
  {
    id: "forest",
    title: "Forest",
    artist: "Nature Sounds",
    gradient: "linear-gradient(135deg,#14532d,#16a34a,#86efac)",
    icon: "🌲",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/forest.mp3",
    category: "nature",
  },
  ...SLEEP_TRACKS,
  // Baby Sleep — lullabies, soft music boxes, white noise. Curated separately
  // and never duplicated in other categories.
  {
    id: "baby-music-box",
    title: "Music Box Sweet Dreams",
    artist: "Denis Pavlov",
    gradient: "linear-gradient(135deg,#fce7f3,#fbcfe8,#f9a8d4)",
    icon: "🧸",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/baby/music-box-sweet-dreams.mp3",
    category: "baby",
  },
  {
    id: "baby-cradle-song",
    title: "Cradle Song",
    artist: "Denis Pavlov",
    gradient: "linear-gradient(135deg,#e0e7ff,#c7d2fe,#a5b4fc)",
    icon: "🌙",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/baby/cradle-song.mp3",
    category: "baby",
  },
  {
    id: "baby-naps-are-fun",
    title: "Naps Are Fun",
    artist: "Golden Sound Labs",
    gradient: "linear-gradient(135deg,#fef3c7,#fde68a,#fcd34d)",
    icon: "🍼",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/baby/naps-are-fun.mp3",
    category: "baby",
  },
  {
    id: "baby-sleepy-bear",
    title: "Sleepy Bear Cub",
    artist: "Golden Sound Labs",
    gradient: "linear-gradient(135deg,#fae8ff,#f5d0fe,#e9d5ff)",
    icon: "🐻",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/baby/sleepy-bear-cub.mp3",
    category: "baby",
  },
  {
    id: "baby-calm-lullaby",
    title: "Calm Baby Lullaby",
    artist: "Denis Pavlov",
    gradient: "linear-gradient(135deg,#dbeafe,#bfdbfe,#93c5fd)",
    icon: "✨",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/baby/calm-baby-lullaby.mp3",
    category: "baby",
  },

  {
    id: "meditation",
    title: "Meditation",
    artist: "Calm",
    gradient: "linear-gradient(135deg,#4c1d95,#a78bfa,#fbcfe8)",
    icon: "🧘",
    url: SH(5),
    category: "ambient",
  },
  {
    id: "study",
    title: "Study",
    artist: "Focus",
    gradient: "linear-gradient(135deg,#78350f,#d97706,#fde68a)",
    icon: "📚",
    url: SH(6),
    category: "focus",
  },
  {
    id: "night",
    title: "Night",
    artist: "Ambient",
    gradient: "linear-gradient(135deg,#020617,#1e3a8a,#60a5fa)",
    icon: "✨",
    url: SH(7),
    category: "ambient",
  },
  {
    id: "fishing",
    title: "Lakeside Fishing",
    artist: "Water Ambience",
    gradient: "linear-gradient(135deg,#0c4a6e,#0891b2,#a5f3fc)",
    icon: "🎣",
    url: SH(9),
    category: "fishing",
  },
  {
    id: "river-cast",
    title: "River Cast",
    artist: "Water Ambience",
    gradient: "linear-gradient(135deg,#083344,#0e7490,#67e8f9)",
    icon: "🌊",
    url: SH(10),
    category: "fishing",
  },
  {
    id: "morning-lake",
    title: "Morning Lake",
    artist: "Water Ambience",
    gradient: "linear-gradient(135deg,#134e4a,#0d9488,#5eead4)",
    icon: "🛶",
    url: SH(11),
    category: "fishing",
  },

  // White / ambient noise — masks unpredictable background sounds.
  {
    id: "noise-train",
    title: "Поезд",
    artist: "White Noise",
    gradient: "linear-gradient(135deg,#0f172a,#1e3a8a,#3b82f6)",
    icon: "🚆",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/noise-train.mp3",
    category: "noise",
  },
  {
    id: "noise-plane",
    title: "Самолет",
    artist: "White Noise",
    gradient: "linear-gradient(135deg,#0c1226,#1e293b,#475569)",
    icon: "✈️",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/noise-plane.mp3",
    category: "noise",
  },
  {
    id: "noise-helicopter",
    title: "Вертолет",
    artist: "White Noise",
    gradient: "linear-gradient(135deg,#0f1f1f,#134e4a,#5eead4)",
    icon: "🚁",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/helicopter.mp3",
    category: "noise",
  },
  {
    id: "noise-leaves",
    title: "Шум листвы",
    artist: "White Noise",
    gradient: "linear-gradient(135deg,#052e1a,#14532d,#22c55e)",
    icon: "🍃",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/noise-leaves.mp3",
    category: "noise",
  },
  {
    id: "noise-thunder",
    title: "Гроза",
    artist: "White Noise",
    gradient: "linear-gradient(135deg,#020617,#1e293b,#60a5fa)",
    icon: "⛈️",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/noise-thunder.mp3",
    category: "noise",
  },
  {
    id: "noise-campfire",
    title: "Костер",
    artist: "White Noise",
    gradient: "linear-gradient(135deg,#1a0a04,#7c2d12,#f59e0b)",
    icon: "🔥",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/noise-campfire.mp3",
    category: "noise",
  },
  {
    id: "noise-cat",
    title: "Мурчание кошки",
    artist: "White Noise",
    gradient: "linear-gradient(135deg,#1f1410,#78350f,#fbbf24)",
    icon: "🐈",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/noise-cat.mp3",
    category: "noise",
  },
  {
    id: "noise-buckwheat",
    title: "Звук сгорания гречки",
    artist: "White Noise",
    gradient: "linear-gradient(135deg,#1a0f08,#78350f,#d97706)",
    icon: "🍳",
    url: "https://ubrbvkaspsphdxpsvazq.supabase.co/storage/v1/object/public/audio/white-noise.m4a",
    category: "noise",
  },
];

export const TRACKS: Track[] = RAW_TRACKS.filter((t, i, arr) => arr.findIndex((x) => x.id === t.id) === i);

export const SLEEP_TRACK_IDS = SLEEP_TRACKS.map((t) => t.id);

export const CATEGORIES: { id: TrackCategory; label: string; icon: string; gradient: string }[] = [
  { id: "sleep", label: "Sleep", icon: "🌙", gradient: "linear-gradient(135deg,#0f0f23,#3b1d6e,#7c3aed)" },
  { id: "baby", label: "Baby Sleep", icon: "🧸", gradient: "linear-gradient(135deg,#fce7f3,#e0e7ff,#bfdbfe)" },
  { id: "fishing", label: "Fishing", icon: "🎣", gradient: "linear-gradient(135deg,#083344,#0891b2,#5eead4)" },
  { id: "nature", label: "Nature", icon: "🌲", gradient: "linear-gradient(135deg,#14532d,#16a34a,#86efac)" },
  { id: "focus", label: "Focus", icon: "📚", gradient: "linear-gradient(135deg,#78350f,#d97706,#fde68a)" },
  { id: "ambient", label: "Ambient", icon: "✨", gradient: "linear-gradient(135deg,#020617,#1e3a8a,#60a5fa)" },
  { id: "noise", label: "White Noise", icon: "🌫️", gradient: "linear-gradient(135deg,#1f2937,#6b7280,#e5e7eb)" },
];

export function tracksByCategory(cat: TrackCategory): Track[] {
  return TRACKS.filter((t) => t.category === cat);
}

export type Playlist = { id: string; title: string; count: number; gradient: string };

export const PLAYLISTS: Playlist[] = [
  { id: "deep-sleep", title: "Sleep Sounds", count: 5, gradient: "linear-gradient(135deg,#1a1a2e,#5a3a6e)" },
  { id: "morning", title: "Morning Meditation", count: 8, gradient: "linear-gradient(135deg,#6b4f8a,#d4a574)" },
  { id: "ocean-dreams", title: "Ocean Dreams", count: 15, gradient: "linear-gradient(135deg,#a8d5e2,#e8f4f8)" },
  { id: "forest-amb", title: "Forest Ambience", count: 10, gradient: "linear-gradient(135deg,#2d5016,#68a357)" },
];

type State = {
  current: Track;
  playing: boolean;
  /** Mirror of appStore.favorites — single source of truth is `app-store.ts`. */
  favorites: Set<string>;
  recents: { id: string; at: number }[];
  progress: number;
  currentTime: number;
  duration: number;
  shuffle: boolean;
  repeat: boolean;
  offline: boolean;
  /** Sleep timer: total ms requested, or 0 if inactive. */
  timerMs: number;
  /** Timestamp (ms) when the active sleep timer will fire. 0 if inactive. */
  timerEndsAt: number;
  /** Playback volume 0..1. Persisted, applied to the shared <audio>. */
  volume: number;
};

const STORAGE_KEY = "moodbeats:v3";

function load(): State {
  const base: State = {
    current: TRACKS[0],
    playing: false,
    favorites: appStore.get().favorites,
    recents: [],
    progress: 0,
    currentTime: 0,
    duration: 0,
    shuffle: false,
    repeat: false,
    offline: typeof navigator !== "undefined" && !navigator.onLine,
    timerMs: 0,
    timerEndsAt: 0,
    volume: 0.6,
  };
  if (typeof window === "undefined") return base;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      const savedCurrent =
        p.current && !/orbit/i.test(p.current.title || "") && TRACKS.find((t) => t.id === p.current.id)
          ? p.current
          : TRACKS[0];
      // One-time migration: legacy favorites in player blob → appStore.
      if (Array.isArray(p.favorites) && p.favorites.length && appStore.get().favorites.size === 0) {
        for (const id of p.favorites) appStore.toggleFavorite(id);
      }
      return {
        ...base,
        current: savedCurrent,
        favorites: appStore.get().favorites,
        recents: (p.recents || []).filter((r: { id: string }) => TRACKS.some((t) => t.id === r.id)),
        shuffle: p.shuffle ?? false,
        repeat: p.repeat ?? false,
        volume: typeof p.volume === "number" ? Math.max(0, Math.min(1, p.volume)) : 0.6,
      };
    }
  } catch {}
  return base;
}

let state: State = load();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  // Favorites live in appStore — don't persist them here to avoid drift.
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      current: state.current,
      recents: state.recents,
      shuffle: state.shuffle,
      repeat: state.repeat,
      volume: state.volume,
    }),
  );
}
function emit({ persistState = true }: { persistState?: boolean } = {}) {
  if (persistState) persist();
  listeners.forEach((l) => l());
}
function emitPlayback() {
  listeners.forEach((l) => l());
}


function setPlaying(playing: boolean) {
  if (state.playing === playing) return;
  state = { ...state, playing };
  persist();
  listeners.forEach((l) => l());
}

const FAST_SWITCH_FADE_MS = 80;
const COLD_FADE_MS = 120;
// Metadata + small head buffer only — enough to start playback instantly
// without bloating bandwidth on visible carousels.
const PRELOAD_BYTES = 256_000;
const PRELOAD_AHEAD_COUNT = 2;

function toAbsoluteAudioUrl(src: string): string {
  if (typeof window === "undefined") return src;
  try {
    return new URL(src, window.location.href).href;
  } catch {
    return src;
  }
}

class WarmPreloadCache {
  private warmed = new Set<string>();
  private inflight = new Set<string>();

  has(src: string): boolean {
    return this.warmed.has(toAbsoluteAudioUrl(src));
  }

  warm(src?: string | null) {
    if (typeof window === "undefined" || !src) return;
    const href = toAbsoluteAudioUrl(src);
    if (this.warmed.has(href) || this.inflight.has(href)) return;

    this.inflight.add(href);
    window.setTimeout(() => {
      void this.fetchInitialRange(href).finally(() => this.inflight.delete(href));
    }, 0);
  }

  private async fetchInitialRange(href: string) {
    try {
      const res = await fetch(href, {
        cache: "force-cache",
        headers: { Range: `bytes=0-${PRELOAD_BYTES - 1}` },
      });
      if (!res.ok && res.status !== 206) return;

      if (res.status === 206) {
        await res.arrayBuffer();
        this.warmed.add(href);
        return;
      }

      // If the server ignores Range, read only a small head chunk to warm the
      // connection without duplicating a full large-MP3 download.
      const reader = res.body?.getReader();
      if (!reader) return;
      await reader.read();
      await reader.cancel();
    } catch {
      // Preloading is an optimization only; playback must never depend on it.
    }
  }
}

const warmCache = new WarmPreloadCache();

// AudioEngine ------------------------------------------------------------
// One global HTMLAudioElement wrapped in a small class. Created lazily on
// the client, warmed (preload="auto" + initial src) so the first tap on
// Play streams immediately. All audio I/O in the app must go through this
// engine — never construct another Audio() instance.
class AudioEngine {
  private el: HTMLAudioElement | null = null;
  private pendingSeek: number | null = null;
  private fadeId: ReturnType<typeof setInterval> | null = null;
  private activeCleanup: (() => void) | null = null;
  onTime: (() => void) | null = null;
  onPlay: (() => void) | null = null;
  onPause: (() => void) | null = null;
  onEnded: (() => void) | null = null;
  onError: (() => void) | null = null;

  ensure(): HTMLAudioElement | null {
    if (typeof window === "undefined") return null;
    if (this.el) return this.el;
    const a = this.createElement();
    this.el = a;
    this.bindActive(a);
    return a;
  }

  private createElement(): HTMLAudioElement {
    const a = new Audio();
    a.preload = "auto";
    a.controls = false;
    (a as HTMLAudioElement & { playsInline?: boolean }).playsInline = true;
    a.setAttribute("playsinline", "");
    a.crossOrigin = "anonymous";
    a.setAttribute("controlsList", "nodownload");
    return a;
  }

  private bindActive(a: HTMLAudioElement) {
    this.activeCleanup?.();
    const time = () => this.onTime?.();
    const loaded = () => { this.applyPending(); time(); };
    const play = () => this.onPlay?.();
    const pause = () => this.onPause?.();
    const ended = () => this.onEnded?.();
    const error = () => this.onError?.();
    a.addEventListener("timeupdate", time);
    a.addEventListener("durationchange", time);
    a.addEventListener("seeking", time);
    a.addEventListener("seeked", time);
    a.addEventListener("loadedmetadata", loaded);
    a.addEventListener("canplay", loaded);
    a.addEventListener("play", play);
    a.addEventListener("pause", pause);
    a.addEventListener("ended", ended);
    a.addEventListener("error", error);
    this.activeCleanup = () => {
      a.removeEventListener("timeupdate", time);
      a.removeEventListener("durationchange", time);
      a.removeEventListener("seeking", time);
      a.removeEventListener("seeked", time);
      a.removeEventListener("loadedmetadata", loaded);
      a.removeEventListener("canplay", loaded);
      a.removeEventListener("play", play);
      a.removeEventListener("pause", pause);
      a.removeEventListener("ended", ended);
      a.removeEventListener("error", error);
    };
  }

  get raw(): HTMLAudioElement | null { return this.el; }
  get duration(): number {
    const d = this.el?.duration;
    return typeof d === "number" && Number.isFinite(d) ? d : 0;
  }
  get currentTime(): number {
    const t = this.el?.currentTime;
    return typeof t === "number" && Number.isFinite(t) ? t : 0;
  }
  get paused(): boolean { return this.el?.paused ?? true; }
  get src(): string { return this.el?.src ?? ""; }

  sameSource(src: string): boolean {
    const a = this.el;
    if (!a || !a.src) return false;
    try {
      return new URL(a.src).href === toAbsoluteAudioUrl(src);
    } catch {
      return a.src.endsWith(src);
    }
  }

  isWarm(src: string): boolean {
    return this.sameSource(src) || warmCache.has(src);
  }

  setSrc(src: string, { reset = true }: { reset?: boolean } = {}) {
    const a = this.ensure();
    if (!a) return;
    // Same track already loaded — never reassign src or call load().
    // Reassignment forces a fresh network fetch and discards the decode buffer,
    // which is the main source of the 0.5–1s "play" delay on resume.
    if (this.sameSource(src)) return;
    a.src = src;
    if (reset) {
      try { a.currentTime = 0; } catch {}
    }
    // Assigning .src already schedules an implicit load() per the HTML spec.
    // Calling a.load() explicitly aborts any in-flight fetch and starts over,
    // doubling startup latency. Do NOT call it here.
  }

  warm(src: string) {
    const a = this.ensure();
    if (!a) return;
    if (this.sameSource(src)) return;
    // Only the current/initial track may occupy the single media element.
    // Future likely tracks are warmed through HTTP cache so switching source
    // does not duplicate buffering or rebuild a second decoder.
    if (!a.src) {
      a.src = src;
      return;
    }
    warmCache.warm(src);
  }

  setVolume(v: number) {
    const a = this.ensure();
    if (a) a.volume = v;
  }
  setLoop(v: boolean) {
    const a = this.ensure();
    if (a) a.loop = v;
  }
  async play(): Promise<void> {
    const a = this.ensure();
    if (!a) return;
    await a.play();
  }
  pause() { this.el?.pause(); }

  setCurrentTime(t: number) {
    const a = this.ensure();
    if (!a) return;
    try { a.currentTime = t; } catch {}
  }

  seekFraction(p: number) {
    const a = this.ensure();
    if (!a) return;
    const clamped = Math.max(0, Math.min(1, p));
    this.pendingSeek = clamped;

    const apply = () => {
      if (this.pendingSeek === null) return;
      if (!Number.isFinite(a.duration) || a.duration === 0) return;
      try { a.currentTime = this.pendingSeek * a.duration; } catch {}
      this.pendingSeek = null;
    };

    // READY → apply immediately.
    if (a.readyState >= 1 && Number.isFinite(a.duration) && a.duration > 0) {
      apply();
      return;
    }

    // Fallback: wait until metadata/buffer can actually seek.
    const handler = () => {
      apply();
      a.removeEventListener("canplay", handler);
      a.removeEventListener("loadedmetadata", handler);
    };
    a.addEventListener("canplay", handler, { once: true });
    a.addEventListener("loadedmetadata", handler, { once: true });

    // Safety net for streams that never fire metadata cleanly.
    setTimeout(apply, 1000);
  }

  private applyPending() {
    const a = this.el;
    if (!a || this.pendingSeek === null) return;
    if (Number.isFinite(a.duration) && a.duration > 0) {
      try { a.currentTime = this.pendingSeek * a.duration; } catch {}
      this.pendingSeek = null;
    }
  }

  rampVolume(target: number, ms: number) {
    const a = this.ensure();
    if (!a) return;
    if (this.fadeId) { clearInterval(this.fadeId); this.fadeId = null; }
    const start = a.volume;
    const t0 = performance.now();
    this.fadeId = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      a.volume = Math.max(0, Math.min(1, start + (target - start) * k));
      if (k >= 1 && this.fadeId) { clearInterval(this.fadeId); this.fadeId = null; }
    }, 40);
  }
}

const engine = new AudioEngine();
let loadToken = 0;

function preloadLikelyTracks(current: Track) {
  if (!current?.url || typeof window === "undefined") return;
  const urls = new Set<string>();
  const add = (track?: Track) => {
    if (track?.url && track.id !== current.id) urls.add(track.url);
  };

  add(pickNext(current));
  add(pickPrev(current));
  const pool = current.category ? tracksByCategory(current.category) : TRACKS;
  const start = Math.max(0, pool.findIndex((t) => t.id === current.id));
  for (let offset = 1; urls.size < PRELOAD_AHEAD_COUNT && offset <= pool.length; offset += 1) {
    add(pool[(start + offset) % pool.length]);
  }
  urls.forEach((url) => warmCache.warm(url));
}

function readEngineTime() {
  const duration = engine.duration || state.duration;
  const currentTime = engine.currentTime || state.currentTime;
  state = {
    ...state,
    duration: duration || 0,
    currentTime: currentTime || 0,
    progress: duration ? Math.max(0, Math.min(1, currentTime / duration)) : state.progress,
  };
}

function bootEngine() {
  if (typeof window === "undefined") return;
  const a = engine.ensure();
  if (!a) return;
  a.volume = state.volume;

  engine.onTime = () => { readEngineTime(); emitPlayback(); };
  engine.onPlay = () => setPlaying(true);
  engine.onPause = () => setPlaying(false);
  engine.onError = () => setPlaying(false);
  engine.onEnded = () => {
    if (state.repeat) {
      engine.setCurrentTime(0);
      void engine.play().catch(() => {});
    } else if (appStore.get().autoplayNext) {
      api.next();
    } else {
      setPlaying(false);
    }
  };

  // Warm-buffer the persisted current track so the first Play is instant.
  if (state.current?.url) {
    engine.warm(state.current.url);
    preloadLikelyTracks(state.current);
  }

  window.addEventListener("online", () => {
    state = { ...state, offline: false };
    emit();
  });
  window.addEventListener("offline", () => {
    state = { ...state, offline: true };
    emit();
  });
}
bootEngine();

function resolveTrackSrc(track: Track): string | null {
  if (typeof navigator !== "undefined" && !navigator.onLine) return null;
  return track.url ?? null;
}

function updateMediaSession(track: Track) {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title,
    artist: track.artist,
    album: "MoodBeats",
  });
  navigator.mediaSession.setActionHandler("play", () => api.toggle());
  navigator.mediaSession.setActionHandler("pause", () => api.toggle());
  navigator.mediaSession.setActionHandler("nexttrack", () => api.next());
  navigator.mediaSession.setActionHandler("previoustrack", () => api.prev());
}

function indexOf(id: string) {
  const i = TRACKS.findIndex((t) => t.id === id);
  return i < 0 ? 0 : i;
}

// Smart same-category recommendation. Avoids repeating the most recent
// tracks (history) for a smooth, varied continuous-listening session.
function pickNext(current: Track): Track {
  const cat = current.category;
  const ordered = cat ? tracksByCategory(cat) : TRACKS;
  const pool = ordered.filter((t) => t.id !== current.id);
  if (ordered.length <= 1 || pool.length === 0) {
    const i = indexOf(current.id);
    return TRACKS[(i + 1) % TRACKS.length];
  }
  const recentIds = new Set(state.recents.slice(0, Math.min(pool.length - 1, 5)).map((r) => r.id));
  const fresh = pool.filter((t) => !recentIds.has(t.id));
  const candidates = fresh.length ? fresh : pool;
  if (state.shuffle) return candidates[Math.floor(Math.random() * candidates.length)];
  const idx = ordered.findIndex((t) => t.id === current.id);
  return ordered[(idx + 1 + ordered.length) % ordered.length] ?? candidates[0];
}

function pickPrev(current: Track): Track {
  const cat = current.category;
  const pool = cat ? tracksByCategory(cat) : TRACKS;
  if (pool.length <= 1) return current;
  const idx = pool.findIndex((t) => t.id === current.id);
  return pool[(idx - 1 + pool.length) % pool.length];
}

let sleepTimeoutId: ReturnType<typeof setTimeout> | null = null;

const api = {
  get: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  preload: (track: Track) => {
    if (track.url) engine.warm(track.url);
    preloadLikelyTracks(track);
  },
  /** Set current track without starting playback. */
  select: (track: Track) => {
    const sameTrack = state.current?.id === track.id;
    state = {
      ...state,
      current: track,
      // Preserve playing state when re-selecting the same track (e.g. tapping
      // its row to open the full player while it's already playing).
      playing: sameTrack ? state.playing : false,
      progress: sameTrack ? state.progress : 0,
      currentTime: sameTrack ? state.currentTime : 0,
      duration: sameTrack ? state.duration : 0,
    };
    if (!sameTrack) {
      engine.pause();
      if (track.url) engine.setSrc(track.url); // warm-load new track
    }
    preloadLikelyTracks(track);
    emit();
    updateMediaSession(track);
  },
  // Play a track. If it's already current, just resume — preserves seek position.
  play: async (track: Track, opts?: { fadeIn?: boolean }) => {
    const token = ++loadToken;
    // White-noise tracks must always restart from 00:00 — never resume.
    const isNoise = track.category === "noise";
    const sameTrack = !isNoise && state.current?.id === track.id;
    const src = resolveTrackSrc(track);
    state = {
      ...state,
      current: track,
      playing: true,
      progress: sameTrack ? state.progress : 0,
      currentTime: sameTrack ? state.currentTime : 0,
      duration: sameTrack ? state.duration : 0,
      recents: [{ id: track.id, at: Date.now() }, ...state.recents.filter((r) => r.id !== track.id)].slice(0, 10),
    };
    emit();
    updateMediaSession(track);
    const targetVol = state.volume;
    const doFade = opts?.fadeIn ?? appStore.get().fadeIn;

    if (sameTrack && src && engine.sameSource(src)) {
      try {
        await engine.play();
      } catch {
        state = { ...state, playing: false };
        emit();
        return;
      }
      preloadLikelyTracks(track);
      return;
    }

    if (token !== loadToken) return;
    if (!src) {
      state = { ...state, playing: false };
      emit();
      return;
    }
    const wasWarm = engine.isWarm(src);
    engine.setSrc(src);
    if (isNoise) { try { engine.setCurrentTime(0); } catch {} }
    try {
      // Start near target volume so audio is audible from the very first
      // frame; the short fade only smooths the attack transient.
      if (doFade) engine.setVolume(Math.max(0, targetVol * 0.6));
      await engine.play();
      if (doFade) engine.rampVolume(targetVol, wasWarm ? FAST_SWITCH_FADE_MS : COLD_FADE_MS);
      preloadLikelyTracks(track);
    } catch {
      state = { ...state, playing: false };
      emit();
    }
  },
  toggle: async () => {
    if (!engine.src && state.current?.url) {
      const src = resolveTrackSrc(state.current);
      if (src) engine.setSrc(src);
    }
    if (engine.paused) {
      // White-noise: always rewind to 00:00 on replay.
      if (state.current?.category === "noise") {
        try { engine.setCurrentTime(0); } catch {}
      }
      try {
        await engine.play();
        preloadLikelyTracks(state.current);
      } catch {}
    } else {
      engine.pause();
      // White-noise: pausing also rewinds, so the next play() is fresh.
      if (state.current?.category === "noise") {
        try { engine.setCurrentTime(0); } catch {}
      }
    }
  },
  next: () => {
    void api.play(pickNext(state.current));
  },
  prev: () => {
    if (engine.currentTime > 3) {
      engine.setCurrentTime(0);
      readEngineTime();
      emitPlayback();
      return;
    }
    void api.play(pickPrev(state.current));
  },
  playCategory: (cat: TrackCategory) => {
    const list = tracksByCategory(cat);
    if (!list.length) return;
    const pick = state.shuffle ? list[Math.floor(Math.random() * list.length)] : list[0];
    void api.play(pick);
  },
  setVolume: (v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    state = { ...state, volume: clamped };
    engine.setVolume(clamped);
    emit();
  },
  seek: (p: number) => {
    const clamped = Math.max(0, Math.min(1, p));
    const dur = engine.duration || state.duration;
    // Optimistic UI update so the slider thumb doesn't snap during a drag.
    state = {
      ...state,
      progress: clamped,
      currentTime: dur ? clamped * dur : state.currentTime,
    };
    emitPlayback();
    // If no source yet, attach one so metadata can load.
    if (!engine.src && state.current?.url) engine.setSrc(state.current.url);
    engine.seekFraction(clamped);
  },
  toggleFav: (id: string) => {
    appStore.toggleFavorite(id);
  },
  toggleShuffle: () => {
    state = { ...state, shuffle: !state.shuffle };
    emit();
  },
  toggleRepeat: () => {
    state = { ...state, repeat: !state.repeat };
    emit();
  },
  /** Start a sleep timer of `minutes` minutes. */
  setSleepTimer: (minutes: number) => {
    if (sleepTimeoutId !== null) {
      clearTimeout(sleepTimeoutId);
      sleepTimeoutId = null;
    }
    const ms = Math.max(0, Math.round(minutes * 60_000));
    engine.setLoop(ms > 0);
    if (ms === 0) {
      state = { ...state, timerMs: 0, timerEndsAt: 0 };
      emit();
      return;
    }
    sleepTimeoutId = setTimeout(() => {
      sleepTimeoutId = null;
      const el = engine.raw;
      if (!el) return;
      // Fade out over 4 seconds, then pause and restore volume.
      const startVol = el.volume;
      const steps = 20;
      const stepMs = 200;
      let i = 0;
      const fade = setInterval(() => {
        i += 1;
        el.volume = Math.max(0, startVol * (1 - i / steps));
        if (i >= steps) {
          clearInterval(fade);
          engine.setLoop(false);
          engine.pause();
          el.volume = startVol;
          state = { ...state, timerMs: 0, timerEndsAt: 0, playing: false };
          emit();
        }
      }, stepMs);
    }, ms);
    state = { ...state, timerMs: ms, timerEndsAt: Date.now() + ms };
    emit();
  },
  clearSleepTimer: () => {
    if (sleepTimeoutId !== null) {
      clearTimeout(sleepTimeoutId);
      sleepTimeoutId = null;
    }
    engine.setLoop(false);
    state = { ...state, timerMs: 0, timerEndsAt: 0 };
    emit();
  },
};

export const player = api;

// Mirror appStore favorites into player state so existing UI that reads
// `s.favorites.has(id)` keeps working and re-renders on change.
if (typeof window !== "undefined") {
  appStore.subscribe(() => {
    const next = appStore.get().favorites;
    if (next === state.favorites) return;
    state = { ...state, favorites: next };
    listeners.forEach((l) => l());
  });
}

export function usePlayer() {
  return useSyncExternalStore(
    (l) => player.subscribe(l),
    () => state,
    () => state,
  );
}

/**
 * Subscribe to a narrow slice of player state. Components using this hook
 * only re-render when the selected value (compared via `isEqual`, default
 * Object.is) actually changes — so 4 Hz `timeupdate` ticks do NOT cause
 * dozens of list rows to re-render during playback. This is the primary
 * fix for the audio-playback UI freeze.
 */
export function usePlayerSelector<T>(
  selector: (s: State) => T,
  isEqual?: (a: T, b: T) => boolean,
): T {
  return useSyncExternalStoreWithSelector(
    (l) => player.subscribe(l),
    () => state,
    () => state,
    selector,
    isEqual,
  );
}

export function tupleEqual<T extends readonly unknown[]>(a: T, b: T): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) if (!Object.is(a[i], b[i])) return false;
  return true;
}

