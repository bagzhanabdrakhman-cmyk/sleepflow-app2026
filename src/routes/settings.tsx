import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sun, Moon, Contrast, Check, ChevronRight, Sparkles, Waves, SkipForward } from "lucide-react";
import { useTheme, themeStore, type Theme } from "@/lib/theme";
import { useLang, useT } from "@/lib/i18n";
import { findLanguage, ALL_LANGUAGES } from "@/i18n/languages";
import { appStore, useAppState } from "@/lib/app-store";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — SleepFlow" }] }),
  component: SettingsPage,
});

const THEME_OPTIONS: {
  id: Theme;
  labelKey: string;
  descKey: string;
  icon: typeof Sun;
  swatch: string;
}[] = [
  {
    id: "dark",
    labelKey: "settings.theme.dark",
    descKey: "settings.theme.dark.desc",
    icon: Moon,
    swatch: "linear-gradient(135deg,#0b1030,#1a1747 60%,#2a1a55)",
  },
  {
    id: "light",
    labelKey: "settings.theme.light",
    descKey: "settings.theme.light.desc",
    icon: Sun,
    swatch: "linear-gradient(135deg,#ffffff,#f1f5f9 60%,#e2e8f0)",
  },
  {
    id: "minimal",
    labelKey: "settings.theme.minimal",
    descKey: "settings.theme.minimal.desc",
    icon: Contrast,
    swatch: "linear-gradient(135deg,#000 50%,#fff 50%)",
  },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground/80 mb-3 px-1">
      {children}
    </h2>
  );
}

function ToggleRow({
  icon: Icon,
  title,
  desc,
  checked,
  onChange,
  first,
  last,
}: {
  icon: typeof Sun;
  title: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  first?: boolean;
  last?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center gap-4 px-4 py-3.5 bg-surface/60 ring-1 ring-white/[0.06] backdrop-blur-sm tap hover:bg-white/[0.03] transition-colors text-left ${
        first ? "rounded-t-3xl" : ""
      } ${last ? "rounded-b-3xl" : ""} ${!first && !last ? "" : ""} ${
        !last ? "border-b border-white/[0.04]" : ""
      }`}
    >
      <div className="h-10 w-10 rounded-2xl bg-surface-elevated ring-1 ring-white/10 grid place-items-center">
        <Icon className="h-5 w-5 text-foreground/80" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-[15px] tracking-tight">{title}</div>
        <div className="text-[12px] text-muted-foreground/80 mt-0.5">{desc}</div>
      </div>
      <span
        aria-hidden
        className={`relative h-[28px] w-[46px] rounded-full transition-colors ${
          checked ? "bg-brand" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow transition-all ${
            checked ? "left-[21px]" : "left-[3px]"
          }`}
        />
      </span>
    </button>
  );
}

function SettingsPage() {
  const t = useT();
  const theme = useTheme();
  const lang = useLang();
  const app = useAppState();
  const current = findLanguage(lang);

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      <Link to="/profile" className="inline-flex items-center gap-1 text-sm text-muted-foreground tap">
        <ArrowLeft className="h-4 w-4" /> {t("common.back")}
      </Link>

      <header>
        <h1 className="text-[28px] font-semibold tracking-tight">{t("settings.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("settings.subtitle")}</p>
      </header>

      {/* Appearance ----------------------------------------------------- */}
      <section>
        <SectionTitle>{t("settings.appearance")}</SectionTitle>
        <div
          role="radiogroup"
          aria-label={t("settings.appearance")}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {THEME_OPTIONS.map(({ id, labelKey, descKey, icon: Icon, swatch }) => {
            const active = theme === id;
            return (
              <button
                key={id}
                role="radio"
                aria-checked={active}
                onClick={() => themeStore.set(id)}
                className={`group relative flex flex-col items-start gap-3 p-4 rounded-3xl text-left tap transition-all ${
                  active
                    ? "bg-surface ring-2 ring-brand shadow-[0_10px_30px_rgba(124,58,237,0.18)]"
                    : "bg-surface/60 ring-1 ring-white/[0.06] hover:ring-white/15 shadow-[0_4px_18px_rgba(0,0,0,0.18)]"
                }`}
              >
                <div
                  className="relative h-20 w-full rounded-2xl ring-1 ring-white/10 overflow-hidden"
                  style={{ background: swatch }}
                >
                  <div className="absolute top-2 left-2 h-2 w-10 rounded-full bg-white/40" />
                  <div className="absolute top-5 left-2 h-2 w-6 rounded-full bg-white/25" />
                  <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-white/70" />
                </div>

                <div className="flex items-center gap-2 w-full">
                  <Icon className="h-4 w-4 text-foreground/80" />
                  <div className="font-semibold tracking-tight">{t(labelKey)}</div>
                  <span
                    aria-hidden
                    className={`ml-auto h-[20px] w-[20px] rounded-full grid place-items-center transition-all ${
                      active ? "bg-brand" : "bg-transparent ring-2 ring-white/20"
                    }`}
                  >
                    {active && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                  </span>
                </div>
                <div className="text-[12px] text-muted-foreground/85 leading-snug">
                  {t(descKey)}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Language ------------------------------------------------------- */}
      <section>
        <SectionTitle>{t("settings.language")}</SectionTitle>
        <Link
          to="/language"
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-3xl bg-surface/60 ring-1 ring-white/[0.06] shadow-[0_8px_28px_rgba(0,0,0,0.25)] backdrop-blur-sm tap hover:bg-white/[0.03] transition-colors"
        >
          <div className="h-10 w-10 rounded-2xl bg-surface-elevated ring-1 ring-white/10 grid place-items-center text-lg select-none">
            <span aria-hidden>{current?.flag ?? "🌐"}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-[15px] tracking-tight truncate">
              {current?.native ?? lang}
            </div>
            <div className="text-[12px] text-muted-foreground/80 mt-0.5 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-brand" />
              {ALL_LANGUAGES.length}+ AI-translated languages
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </section>

      {/* Sleep Preferences --------------------------------------------- */}
      <section>
        <SectionTitle>{t("settings.sleep")}</SectionTitle>
        <div className="rounded-3xl overflow-hidden shadow-[0_8px_28px_rgba(0,0,0,0.25)]">
          <ToggleRow
            icon={Waves}
            title={t("settings.sleep.fadeIn")}
            desc={t("settings.sleep.fadeIn.desc")}
            checked={app.fadeIn}
            onChange={appStore.setFadeIn}
            first
          />
          <ToggleRow
            icon={SkipForward}
            title={t("settings.sleep.autoplay")}
            desc={t("settings.sleep.autoplay.desc")}
            checked={app.autoplayNext}
            onChange={appStore.setAutoplayNext}
            last
          />
        </div>
      </section>

      {/* AI Features --------------------------------------------------- */}
      <section>
        <SectionTitle>{t("settings.ai")}</SectionTitle>
        <div className="rounded-3xl overflow-hidden shadow-[0_8px_28px_rgba(0,0,0,0.25)]">
          <ToggleRow
            icon={Sparkles}
            title={t("settings.ai.translate")}
            desc={t("settings.ai.translate.desc")}
            checked={app.autoTranslate}
            onChange={appStore.setAutoTranslate}
            first
            last
          />
        </div>
      </section>
    </div>
  );
}
