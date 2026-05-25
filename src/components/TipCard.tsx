import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Wind, Sparkles, Moon, Waves } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useT } from "@/lib/i18n";
import { todayTip } from "@/lib/daily-tip";
import { BreathingExercise } from "./BreathingExercise";
import catImg from "@/assets/sleeping-cat.png";

const categoryFor = (kind: string) => {
  if (kind === "breathing") return { key: "tip.cat.breathing", icon: Wind };
  if (kind === "whiteNoise") return { key: "tip.cat.whiteNoise", icon: Waves };
  return { key: "tip.cat.text", icon: Moon };
};

export function TipCard() {
  const t = useT();
  const nav = useNavigate();
  const tip = todayTip();
  const [expanded, setExpanded] = useState(false);
  const [breathing, setBreathing] = useState(false);

  const cat = categoryFor(tip.kind);
  const CatIcon = cat.icon;
  const detail = t(`daily.tip.${tip.id}.detail`);

  return (
    <section className="animate-fade-in-up">
      <div
        className="relative overflow-hidden rounded-[28px] ring-1 ring-white/10 shadow-[var(--shadow-card)] backdrop-blur-md transition-all duration-500"
        style={{
          background:
            "linear-gradient(135deg, rgba(40,30,80,0.55) 0%, rgba(20,25,60,0.65) 55%, rgba(60,30,90,0.5) 100%)",
        }}
      >
        {/* Soft glow accents */}
        <div className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.28),transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.18),transparent_70%)]" />

        <div className="relative px-5 pt-5 pb-5">
          <div className="flex items-start gap-3">
            {/* LEFT */}
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] ring-1 ring-white/10 px-2.5 py-1">
                <CatIcon className="h-3 w-3 text-brand" />
                <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/75">
                  {t(cat.key)}
                </span>
              </div>

              <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground/70">
                {t("home.tipTitle")}
              </p>

              <p className="mt-1.5 text-[15px] leading-[1.6] text-foreground/95 font-light tracking-[0.005em]">
                {tip.kind === "whiteNoise" ? (
                  <>
                    {t("daily.tip.15.before")}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nav({ to: "/white-noise" });
                      }}
                      className="font-medium text-[#7cb6ff] underline decoration-dotted underline-offset-[3px] tap"
                    >
                      {t("daily.tip.15.term")}
                    </button>
                    {t("daily.tip.15.after")}
                  </>
                ) : (
                  t(`daily.tip.${tip.id}`)
                )}
              </p>
            </div>

            {/* RIGHT — sleeping cat */}
            <div className="relative shrink-0 h-[80px] w-[88px]">
              <span aria-hidden className="cat-z absolute top-0 right-2 text-[11px] font-semibold text-foreground/55 select-none">z</span>
              <span aria-hidden className="cat-z cat-z-2 absolute top-2 right-5 text-[9px] font-semibold text-foreground/40 select-none">z</span>
              <img
                src={catImg}
                alt=""
                aria-hidden
                loading="lazy"
                width={72}
                height={72}
                className="cat-breathe absolute bottom-0 right-0 h-[72px] w-[72px] object-contain opacity-95 drop-shadow-[0_6px_18px_rgba(124,58,237,0.35)] select-none"
              />
            </div>
          </div>

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-3 inline-flex items-center gap-1 text-xs text-brand tap"
            aria-expanded={expanded}
          >
            {expanded ? t("tip.less") : t("tip.more")}
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            />
          </button>

          {/* Expanded content */}
          <div
            className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
              expanded ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="rounded-2xl bg-white/[0.04] ring-1 ring-white/5 p-4">
                <p className="text-[13.5px] leading-relaxed text-foreground/85">{detail}</p>

                {tip.kind === "breathing" && (
                  <button
                    onClick={() => setBreathing(true)}
                    className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium text-white shadow-md tap"
                    style={{ background: "linear-gradient(135deg,#3b1d6e,#7c3aed)" }}
                  >
                    <Wind className="h-4 w-4" />
                    {t("breathing.start")}
                  </button>
                )}

                {tip.kind === "whiteNoise" && (
                  <button
                    onClick={() => nav({ to: "/white-noise" })}
                    className="mt-3 w-full inline-flex items-center justify-between gap-2 rounded-full px-4 py-2.5 bg-white/[0.06] ring-1 ring-white/10 text-sm tap"
                  >
                    <span>{t("tip.openWhiteNoise")}</span>
                    <ArrowRight className="h-4 w-4 text-brand" />
                  </button>
                )}

                {tip.kind === "text" && (
                  <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground/80">
                    <Sparkles className="h-3 w-3 text-brand" />
                    {t("tip.gentleReminder")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breathing overlay */}
      <Dialog open={breathing} onOpenChange={setBreathing}>
        <DialogContent className="max-w-md bg-surface border-white/10 text-foreground">
          <DialogHeader>
            <DialogTitle className="text-base">{t("breathing.title")}</DialogTitle>
          </DialogHeader>
          <BreathingExercise onClose={() => setBreathing(false)} />
        </DialogContent>
      </Dialog>
    </section>
  );
}
