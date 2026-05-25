import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sun,
  Moon,
  Minus,
  Check,
  Languages,
  User as UserIcon,
  Bell,
  CalendarClock,
  ClipboardList,
  Crown,
  ChevronRight,
} from "lucide-react";
import { useTheme, themeStore, type Theme } from "@/lib/theme";
import { useLang, useT } from "@/lib/i18n";
import { findLanguage } from "@/i18n/languages";
import { sleepProfile, useSleepProfile } from "@/lib/sleep-profile";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — SleepFlow" }] }),
  component: AccountPage,
});

const THEME_OPTIONS: { id: Theme; labelKey: string; descKey: string; icon: typeof Sun }[] = [
  { id: "dark", labelKey: "settings.theme.dark", descKey: "settings.theme.dark.desc", icon: Moon },
  { id: "light", labelKey: "settings.theme.light", descKey: "settings.theme.light.desc", icon: Sun },
  { id: "minimal", labelKey: "settings.theme.minimal", descKey: "settings.theme.minimal.desc", icon: Minus },
];

function AccountPage() {
  const t = useT();
  const theme = useTheme();
  const lang = useLang();
  const profile = useSleepProfile();

  const toggleNotifs = async () => {
    if (!profile.notifications) {
      const perm = await sleepProfile.requestNotificationPermission();
      sleepProfile.update({ notifications: perm === "granted" });
    } else {
      sleepProfile.update({ notifications: false });
    }
  };

  return (
    <div className="space-y-7 animate-fade-in-up pb-20">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{t("account.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("account.subtitle")}</p>
      </header>

      {/* Profile */}
      <section className="rounded-3xl bg-surface ring-1 ring-white/5 p-5 flex items-center gap-4">
        <div className="h-16 w-16 rounded-full gradient-brand flex items-center justify-center shadow-[var(--shadow-card)]">
          <UserIcon className="h-7 w-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-lg">{t("profile.handle")}</div>
          <div className="text-xs text-muted-foreground">{t("profile.freePlan")}</div>
        </div>
        <Crown className="h-5 w-5 text-yellow-400" />
      </section>

      {/* Theme */}
      <section>
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">{t("settings.appearance")}</h2>
        <div className="space-y-2">
          {THEME_OPTIONS.map(({ id, labelKey, descKey, icon: Icon }) => {
            const active = theme === id;
            return (
              <button
                key={id}
                onClick={() => themeStore.set(id)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl bg-surface tap border transition-colors ${
                  active ? "border-brand" : "border-transparent"
                }`}
              >
                <div className="h-10 w-10 rounded-xl bg-surface-elevated flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold">{t(labelKey)}</div>
                  <div className="text-xs text-muted-foreground">{t(descKey)}</div>
                </div>
                {active && <Check className="h-5 w-5 text-brand" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Language */}
      <section>
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">{t("settings.language")}</h2>
        <Link
          to="/language"
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-surface tap border border-transparent"
        >
          <div className="h-10 w-10 rounded-xl bg-surface-elevated flex items-center justify-center">
            <Languages className="h-5 w-5" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold">
              {findLanguage(lang)?.native ?? lang}
            </div>
            <div className="text-xs text-muted-foreground">
              {findLanguage(lang)?.name ?? "Tap to change language"}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </section>

      {/* Notifications */}
      <section>
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">{t("account.notifications")}</h2>
        <button
          onClick={toggleNotifs}
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-surface border border-white/5 tap"
        >
          <div className="h-10 w-10 rounded-xl bg-brand/15 flex items-center justify-center">
            <Bell className="h-5 w-5 text-brand" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold">{t("schedule.notif.title")}</div>
            <div className="text-xs text-muted-foreground">{t("schedule.notif.desc")}</div>
          </div>
          <div className={`h-7 w-12 rounded-full p-0.5 transition-colors ${profile.notifications ? "bg-brand" : "bg-white/15"}`}>
            <div
              className={`h-6 w-6 rounded-full bg-white transition-transform ${profile.notifications ? "translate-x-5" : ""}`}
            />
          </div>
        </button>
      </section>

      {/* App preferences */}
      <section>
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">{t("account.preferences")}</h2>
        <div className="space-y-2">
          <Link
            to="/schedule"
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-surface tap"
          >
            <div className="h-10 w-10 rounded-xl bg-surface-elevated flex items-center justify-center">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold">{t("account.bedtime")}</div>
              <div className="text-xs text-muted-foreground">
                {profile.bedtime} · {profile.hours}h
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Link
            to="/survey"
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-surface tap"
          >
            <div className="h-10 w-10 rounded-xl bg-surface-elevated flex items-center justify-center">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold">{t("account.survey")}</div>
              <div className="text-xs text-muted-foreground">{t("account.survey.desc")}</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          <button
            onClick={() => sleepProfile.reset()}
            className="w-full text-left p-4 rounded-2xl bg-surface tap text-sm text-muted-foreground"
          >
            {t("schedule.reset")}
          </button>
        </div>
      </section>
    </div>
  );
}
