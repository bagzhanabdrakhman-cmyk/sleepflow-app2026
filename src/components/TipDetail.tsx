import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Wind, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useT } from "@/lib/i18n";
import type { TipDef } from "@/lib/daily-tip";
import { BreathingExercise } from "./BreathingExercise";

export function TipDetail({
  tip,
  open,
  onOpenChange,
}: {
  tip: TipDef;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const t = useT();
  const nav = useNavigate();
  const [breathing, setBreathing] = useState(false);

  const detail = t(`daily.tip.${tip.id}.detail`);
  const isBreathing = tip.kind === "breathing";
  const isWhiteNoise = tip.kind === "whiteNoise";

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setBreathing(false);
      }}
    >
      <DialogContent className="max-w-md bg-surface border-white/10 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-base">
            {isBreathing ? t("breathing.title") : t("home.tipTitle")}
          </DialogTitle>
        </DialogHeader>

        {breathing ? (
          <BreathingExercise onClose={() => setBreathing(false)} />
        ) : (
          <div className="space-y-4">
            <p className="text-[14px] leading-relaxed text-foreground/90">{detail}</p>

            {isBreathing && (
              <>
                <div className="rounded-2xl bg-white/[0.04] ring-1 ring-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/80">
                    {t("breathing.steps.title")}
                  </p>
                  <ol className="mt-2 space-y-2 text-sm">
                    <li className="flex items-baseline gap-2">
                      <span className="tabular-nums text-brand font-semibold w-8">4s</span>
                      <span>{t("breathing.step.inhale")}</span>
                    </li>
                    <li className="flex items-baseline gap-2">
                      <span className="tabular-nums text-brand font-semibold w-8">7s</span>
                      <span>{t("breathing.step.hold")}</span>
                    </li>
                    <li className="flex items-baseline gap-2">
                      <span className="tabular-nums text-brand font-semibold w-8">8s</span>
                      <span>{t("breathing.step.exhale")}</span>
                    </li>
                  </ol>
                </div>
                <button
                  onClick={() => setBreathing(true)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-medium text-white shadow-lg tap"
                  style={{ background: "linear-gradient(135deg,#3b1d6e,#7c3aed)" }}
                >
                  <Wind className="h-4 w-4" />
                  {t("breathing.start")}
                </button>
              </>
            )}

            {isWhiteNoise && (
              <button
                onClick={() => {
                  onOpenChange(false);
                  nav({ to: "/white-noise" });
                }}
                className="w-full inline-flex items-center justify-between gap-2 rounded-2xl px-4 py-3 bg-white/[0.04] ring-1 ring-white/10 text-sm tap"
              >
                <span>{t("tip.openWhiteNoise")}</span>
                <ArrowRight className="h-4 w-4 text-brand" />
              </button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
