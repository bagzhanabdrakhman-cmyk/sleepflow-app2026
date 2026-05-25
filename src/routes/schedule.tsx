import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bell, Moon } from "lucide-react";
import { sleepProfile, useSleepProfile } from "@/lib/sleep-profile";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/schedule")({
  head: () => ({ meta: [{ title: "Schedule — SleepFlow" }] }),
  component: SchedulePage,
});

const BEDTIMES = ["21:30", "22:00", "22:30", "23:00", "23:30", "00:00"];
const HOURS = [5, 6, 7, 8, 9];

function SchedulePage() {
  const t = useT();
  const p = useSleepProfile();

  const toggleNotifs = async () => {
    if (!p.notifications) {
      const perm = await sleepProfile.requestNotificationPermission();
      sleepProfile.update({ notifications: perm === "granted" });
    } else {
      sleepProfile.update({ notifications: false });
    }
  };

  return (
    <div className="space-y-7 animate-fade-in-up">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground tap">
        <ArrowLeft className="h-4 w-4" /> {t("common.back")}
      </Link>

      <header>
        <h1 className="text-3xl font-bold tracking-tight">{t("schedule.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("schedule.subtitle")}</p>
      </header>

      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <Moon className="h-3.5 w-3.5" /> {t("schedule.bedtime")}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {BEDTIMES.map((time) => (
            <button
              key={time}
              onClick={() => sleepProfile.update({ bedtime: time })}
              className={`h-14 rounded-2xl font-semibold tap border ${
                p.bedtime === time ? "border-brand bg-brand/15" : "border-white/10 bg-surface text-muted-foreground"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t("schedule.duration")}</div>
        <div className="grid grid-cols-5 gap-2">
          {HOURS.map((h) => (
            <button
              key={h}
              onClick={() => sleepProfile.update({ hours: h })}
              className={`h-14 rounded-2xl font-semibold tap border ${
                p.hours === h ? "border-brand bg-brand/15" : "border-white/10 bg-surface text-muted-foreground"
              }`}
            >
              {h}h
            </button>
          ))}
        </div>
      </section>

      <section>
        <button
          onClick={toggleNotifs}
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-surface border border-white/10 tap"
        >
          <div className="h-10 w-10 rounded-xl bg-brand/15 flex items-center justify-center">
            <Bell className="h-5 w-5 text-brand" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold">{t("schedule.notif.title")}</div>
            <div className="text-xs text-muted-foreground">{t("schedule.notif.desc")}</div>
          </div>
          <div className={`h-7 w-12 rounded-full p-0.5 transition-colors ${p.notifications ? "bg-brand" : "bg-white/15"}`}>
            <div
              className={`h-6 w-6 rounded-full bg-white transition-transform ${p.notifications ? "translate-x-5" : ""}`}
            />
          </div>
        </button>
      </section>

      <button
        onClick={() => sleepProfile.reset()}
        className="w-full text-center text-xs text-muted-foreground py-2 tap"
      >
        {t("schedule.reset")}
      </button>
    </div>
  );
}
