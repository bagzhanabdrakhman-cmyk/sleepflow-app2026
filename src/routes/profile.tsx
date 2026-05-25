import { createFileRoute, Link } from "@tanstack/react-router";
import { Headphones, Clock, Award, Crown, Settings, User as UserIcon, ChevronRight } from "lucide-react";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — MoodBeats" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const t = useT();
  const stats = [
    { icon: Headphones, value: "142", label: t("profile.hoursListened") },
    { icon: Clock, value: "89", label: t("profile.sessions") },
    { icon: Award, value: "12", label: t("profile.streak") },
  ];
  const rows: { icon: typeof Crown; label: string; color?: string; to?: string }[] = [
    { icon: Crown, label: t("profile.premium"), color: "text-yellow-400" },
    { icon: Settings, label: t("common.settings"), to: "/settings" },
    { icon: UserIcon, label: t("profile.account") },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="text-3xl font-bold">{t("profile.title")}</h1>

      <div className="flex flex-col items-center">
        <div className="h-24 w-24 rounded-full gradient-brand flex items-center justify-center shadow-[var(--shadow-card)]">
          <UserIcon className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-xl font-bold mt-3">{t("profile.handle")}</h2>
        <p className="text-sm text-muted-foreground">{t("profile.freePlan")}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="bg-surface rounded-2xl p-4 flex flex-col items-center text-center">
            <Icon className="h-5 w-5 text-brand mb-2" />
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-[10px] text-muted-foreground leading-tight mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {rows.map(({ icon: Icon, label, color, to }) => {
          const inner = (
            <>
              <Icon className={`h-5 w-5 ${color || "text-muted-foreground"}`} />
              <span className="flex-1 text-left font-medium">{label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </>
          );
          const cls = "w-full flex items-center gap-3 p-4 rounded-2xl bg-surface tap";
          return to === "/settings" ? (
            <Link key={label} to="/settings" className={cls}>{inner}</Link>
          ) : (
            <button key={label} className={cls}>{inner}</button>
          );
        })}
      </div>

      <div className="rounded-3xl p-5 gradient-premium">
        <Crown className="h-7 w-7 text-yellow-400 mb-2" />
        <h3 className="text-xl font-bold text-white">{t("profile.goPremium")}</h3>
        <p className="text-sm text-white/80 mt-1 mb-4">
          {t("profile.premiumDesc")}
        </p>
        <button className="bg-white text-black font-semibold rounded-full px-6 py-2.5 tap">
          {t("profile.learnMore")}
        </button>
      </div>
    </div>
  );
}
