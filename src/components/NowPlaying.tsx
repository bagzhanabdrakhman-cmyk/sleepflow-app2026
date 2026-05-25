import { ChevronDown, Heart, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward } from "lucide-react";
import { useEffect } from "react";
import { player, usePlayer } from "@/lib/player-store";
import { useT } from "@/lib/i18n";

export function NowPlaying({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  const s = usePlayer();
  const fav = s.favorites.has(s.current.id);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " ") { e.preventDefault(); player.toggle(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 max-w-md mx-auto transition-transform duration-500 ease-out ${open ? "translate-y-0" : "translate-y-full"}`}
        style={{ background: s.current.gradient }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/90" />

        <div className="relative flex flex-col h-full px-6 pt-6 pb-8 text-white">
          <div className="flex items-center justify-between">
            <button onClick={onClose} className="p-2 tap" aria-label={t("common.close")}>
              <ChevronDown className="h-6 w-6" />
            </button>
            <div className="text-xs uppercase tracking-widest text-white/70">{t("common.nowPlaying")}</div>
            <div className="w-10" />
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div
              className={`aspect-square w-full max-w-[300px] rounded-3xl shadow-2xl ring-1 ring-white/20 flex items-center justify-center text-[120px] transition-transform duration-700 ${s.playing ? "scale-100" : "scale-95"}`}
              style={{ background: s.current.gradient }}
            >
              <span className="drop-shadow-2xl">{s.current.icon}</span>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-2xl font-bold tracking-tight truncate">{s.current.title}</h2>
                <p className="text-sm text-white/70 truncate">{s.current.artist}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                
                <button onClick={() => player.toggleFav(s.current.id)} className="p-2 tap" aria-label={t("common.favorite")}>
                  <Heart className={`h-6 w-6 transition-all ${fav ? "fill-[oklch(0.7_0.25_25)] text-[oklch(0.7_0.25_25)] scale-110" : "text-white"}`} />
                </button>
              </div>
            </div>



            <div className="flex items-center justify-between">
              <button onClick={() => player.toggleShuffle()} className="p-2 tap" aria-label={t("common.shuffle")}>
                <Shuffle className={`h-5 w-5 ${s.shuffle ? "text-white" : "text-white/50"}`} />
              </button>
              <button onClick={() => player.prev()} className="p-3 tap" aria-label={t("common.previous")}>
                <SkipBack className="h-7 w-7 fill-current" />
              </button>
              <button
                onClick={() => player.toggle()}
                className="h-16 w-16 rounded-full bg-white text-black flex items-center justify-center tap shadow-2xl"
                aria-label={s.playing ? t("common.pause") : t("common.play")}
              >
                {s.playing ? <Pause className="h-7 w-7 fill-current" /> : <Play className="h-7 w-7 fill-current ml-1" />}
              </button>
              <button onClick={() => player.next()} className="p-3 tap" aria-label={t("common.next")}>
                <SkipForward className="h-7 w-7 fill-current" />
              </button>
              <button onClick={() => player.toggleRepeat()} className="p-2 tap" aria-label={t("common.repeat")}>
                <Repeat className={`h-5 w-5 ${s.repeat ? "text-white" : "text-white/50"}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
