// On-demand translation loader (offline-first hybrid).
//
// Strategy:
//  1. If the locale is built-in (en/ru), no work to do.
//  2. If we already have every English key cached locally for this locale,
//     skip the network entirely — language switch is instant and works
//     fully offline after the first successful load.
//  3. Otherwise hit Supabase for ONLY the missing keys, merge into cache.
//  4. If keys are STILL missing, ask the AI edge function to fill them in
//     and persist. The UI uses the English fallback in the meantime so
//     nothing freezes.
//
// All persistence happens via app-store (localStorage) and the shared
// `translations` table.

import { supabase } from "@/integrations/supabase/client";
import { appStore } from "@/lib/app-store";
import { EN_DICT, BUILTIN_LOCALES } from "@/lib/i18n";

const inflight = new Map<string, Promise<void>>();
// In-memory marker: locales we've already verified are 100% cached this
// session, so subsequent ensureTranslations() calls become true no-ops.
const verifiedComplete = new Set<string>();

function missingKeys(locale: string): string[] {
  const cached = appStore.get().translations[locale] ?? {};
  const out: string[] = [];
  for (const k of Object.keys(EN_DICT)) {
    if (cached[k] === undefined) out.push(k);
  }
  return out;
}

export function ensureTranslations(locale: string): Promise<void> {
  if (!locale || BUILTIN_LOCALES.has(locale)) return Promise.resolve();
  if (verifiedComplete.has(locale)) return Promise.resolve();

  // Fast path: local cache already complete → no network at all.
  if (missingKeys(locale).length === 0) {
    verifiedComplete.add(locale);
    return Promise.resolve();
  }

  const existing = inflight.get(locale);
  if (existing) return existing;

  const p = (async () => {
    let missing = missingKeys(locale);
    if (missing.length === 0) return;

    // 1) Pull only the keys we don't have yet from the shared cache.
    try {
      const { data, error } = await supabase
        .from("translations")
        .select("key,value")
        .eq("locale", locale)
        .in("key", missing);

      if (!error && data && data.length > 0) {
        const map: Record<string, string> = {};
        for (const row of data) map[row.key] = row.value;
        appStore.mergeTranslations(locale, map);
      }
    } catch (e) {
      // Offline or network blip — fall through to AI step (which will also
      // fail offline). The UI keeps using English fallback, no freeze.
      console.warn("[i18n] DB fetch failed:", e);
    }

    missing = missingKeys(locale);
    if (missing.length === 0) {
      verifiedComplete.add(locale);
      return;
    }

    // 2) AI-translate the remaining keys + persist them in the shared DB.
    try {
      const { data: aiData, error: aiErr } = await supabase.functions.invoke(
        "translate-locale",
        {
          body: {
            locale,
            entries: Object.fromEntries(missing.map((k) => [k, EN_DICT[k]])),
          },
        },
      );
      if (aiErr) {
        console.warn("[i18n] AI translation failed:", aiErr.message);
        return;
      }
      if (aiData?.translations) {
        appStore.mergeTranslations(locale, aiData.translations);
      }
    } catch (e) {
      console.warn("[i18n] translate-locale invoke threw:", e);
    }

    if (missingKeys(locale).length === 0) verifiedComplete.add(locale);
  })().finally(() => {
    inflight.delete(locale);
  });

  inflight.set(locale, p);
  return p;
}

// Convenience: switch language AND kick off translation loading.
// Switching is synchronous (instant); loading runs in the background and
// streams new strings into the UI as they arrive.
export function setLanguage(locale: string) {
  appStore.setLang(locale);
  void ensureTranslations(locale);
}
