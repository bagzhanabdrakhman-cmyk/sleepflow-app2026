import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";

type Phase = "inhale" | "hold" | "exhale";
const SEQ: { phase: Phase; secs: number }[] = [
  { phase: "inhale", secs: 4 },
  { phase: "hold", secs: 7 },
  { phase: "exhale", secs: 8 },
];
const TOTAL_CYCLES = 4;

export function BreathingExercise({ onClose }: { onClose?: () => void }) {
  const t = useT();
  const [running, setRunning] = useState(true);
  const [cycle, setCycle] = useState(1);
  const [stepIdx, setStepIdx] = useState(0);
  const [remaining, setRemaining] = useState(SEQ[0].secs);
  const [done, setDone] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running || done) return;
    tickRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r > 1) return r - 1;
        // advance
        setStepIdx((s) => {
          const next = s + 1;
          if (next < SEQ.length) {
            setRemaining(SEQ[next].secs);
            return next;
          }
          // next cycle
          setCycle((c) => {
            if (c >= TOTAL_CYCLES) {
              setDone(true);
              setRunning(false);
              return c;
            }
            return c + 1;
          });
          setRemaining(SEQ[0].secs);
          return 0;
        });
        return r;
      });
    }, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [running, done]);

  const step = SEQ[stepIdx];
  const phaseLabel = t(`breathing.step.${step.phase}`);
  // Animated circle scale based on phase
  const scale = step.phase === "inhale" ? 1 : step.phase === "exhale" ? 0.55 : 1;
  const transition = step.phase === "hold" ? "none" : `transform ${step.secs}s ease-in-out`;

  return (
    <div className="flex flex-col items-center gap-6 py-2">
      <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        {done ? t("breathing.done") : t("breathing.cycle", { n: cycle, total: TOTAL_CYCLES })}
      </div>

      <div className="relative h-56 w-56 grid place-items-center">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.25),transparent_70%)]" />
        <div
          className="h-44 w-44 rounded-full grid place-items-center text-white shadow-xl"
          style={{
            background: "linear-gradient(135deg,#3b1d6e,#7c3aed,#a78bfa)",
            transform: `scale(${scale})`,
            transition,
          }}
        >
          <div className="text-center">
            <div className="text-sm uppercase tracking-[0.2em] opacity-80">{phaseLabel}</div>
            <div className="mt-1 text-5xl font-semibold tabular-nums">{remaining}</div>
            <div className="text-xs opacity-70">{t("breathing.seconds")}</div>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          setRunning(false);
          onClose?.();
        }}
        className="px-6 py-2.5 rounded-full bg-white/[0.06] ring-1 ring-white/10 text-sm tap"
      >
        {t("breathing.stop")}
      </button>
    </div>
  );
}
