import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Check, Search, Sparkles, Loader2 } from "lucide-react";
import { useLang, useT } from "@/lib/i18n";
import { useAppStore } from "@/lib/app-store";
import { setLanguage } from "@/i18n/translate";
import {
  ALL_LANGUAGES,
  POPULAR_CODES,
  findLanguage,
  type LanguageEntry,
} from "@/i18n/languages";

export const Route = createFileRoute("/language")({
  head: () => ({ meta: [{ title: "Language — SleepFlow" }] }),
  component: LanguagePage,
});

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground/80 mb-2 px-1">
      {children}
    </h2>
  );
}

function LangRow({
  l,
  active,
  loading,
  onSelect,
}: {
  l: LanguageEntry;
  active: boolean;
  loading: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      role="radio"
      aria-checked={active}
      onClick={onSelect}
      className={`w-full flex items-center gap-3 px-3.5 py-3 tap text-left transition-colors ${
        active ? "bg-brand/[0.08]" : "hover:bg-white/[0.03]"
      }`}
    >
      <div className="h-9 w-9 rounded-xl bg-surface-elevated ring-1 ring-white/10 grid place-items-center text-base select-none shrink-0">
        <span aria-hidden>{l.flag}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-[15px] tracking-tight truncate">{l.native}</div>
        <div className="text-[12px] text-muted-foreground/80 mt-0.5 truncate">{l.name}</div>
      </div>
      {loading && active ? (
        <Loader2 className="h-4 w-4 animate-spin text-brand shrink-0" />
      ) : (
        <span
          aria-hidden
          className={`relative h-[20px] w-[20px] rounded-full grid place-items-center transition-all shrink-0 ${
            active
              ? "bg-brand shadow-[0_0_0_4px_rgba(168,85,247,0.18)]"
              : "bg-transparent ring-2 ring-white/15"
          }`}
        >
          {active && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
        </span>
      )}
    </button>
  );
}

function Group({ title, items, active, loadingFor, onSelect }: {
  title: string;
  items: LanguageEntry[];
  active: string;
  loadingFor: string | null;
  onSelect: (code: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <section>
      <SectionLabel>{title}</SectionLabel>
      <div
        role="radiogroup"
        className="rounded-3xl bg-surface/60 ring-1 ring-white/[0.06] shadow-[0_8px_28px_rgba(0,0,0,0.25)] backdrop-blur-sm overflow-hidden divide-y divide-white/[0.04]"
      >
        {items.map((l) => (
          <LangRow
            key={l.code}
            l={l}
            active={active === l.code}
            loading={loadingFor === l.code}
            onSelect={() => onSelect(l.code)}
          />
        ))}
      </div>
    </section>
  );
}

function LanguagePage() {
  const t = useT();
  const lang = useLang();
  const recents = useAppStore((s) => s.recentLangs);
  const translations = useAppStore((s) => s.translations);
  const [q, setQ] = useState("");
  const [pending, setPending] = useState<string | null>(null);

  // Loading state for non-builtin languages: pending until cache populated.
  const isLoading = pending === lang && lang !== "en" && lang !== "ru" && !translations[lang];

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return ALL_LANGUAGES;
    return ALL_LANGUAGES.filter(
      (l) =>
        l.code.toLowerCase().includes(needle) ||
        l.name.toLowerCase().includes(needle) ||
        l.native.toLowerCase().includes(needle),
    );
  }, [q]);

  const popular = useMemo(() => {
    if (q.trim()) return [];
    return POPULAR_CODES.map((c) => findLanguage(c)).filter(Boolean) as LanguageEntry[];
  }, [q]);

  const recent = useMemo(() => {
    if (q.trim()) return [];
    return recents
      .map((c) => findLanguage(c))
      .filter(Boolean) as LanguageEntry[];
  }, [q, recents]);

  const handleSelect = (code: string) => {
    setPending(code);
    setLanguage(code);
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <Link to="/settings" className="inline-flex items-center gap-1 text-sm text-muted-foreground tap">
        <ArrowLeft className="h-4 w-4" /> {t("common.back")}
      </Link>

      <header>
        <h1 className="text-[28px] font-semibold tracking-tight">{t("settings.language")}</h1>
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-brand" />
          AI-powered translations · {ALL_LANGUAGES.length}+ languages
        </p>
      </header>

      {/* Search ----------------------------------------------------------- */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search languages…"
          className="w-full bg-surface/70 ring-1 ring-white/[0.06] rounded-2xl pl-11 pr-4 py-3 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Generating translations…
        </div>
      )}

      {q.trim() ? (
        <Group
          title={`${filtered.length} results`}
          items={filtered}
          active={lang}
          loadingFor={pending}
          onSelect={handleSelect}
        />
      ) : (
        <>
          {recent.length > 0 && (
            <Group
              title="Recent"
              items={recent}
              active={lang}
              loadingFor={pending}
              onSelect={handleSelect}
            />
          )}
          <Group
            title="Popular"
            items={popular}
            active={lang}
            loadingFor={pending}
            onSelect={handleSelect}
          />
          <Group
            title="All languages"
            items={ALL_LANGUAGES}
            active={lang}
            loadingFor={pending}
            onSelect={handleSelect}
          />
        </>
      )}
    </div>
  );
}
