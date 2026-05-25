// AI-powered locale translator.
// Receives { locale, entries: { key: english } }, asks Lovable AI Gateway to
// translate every English value to the target locale, upserts into the
// `translations` table, and returns the translated map.

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

// Chunk large entries into smaller groups so prompts stay within model limits.
const CHUNK_SIZE = 60;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function translateChunk(
  locale: string,
  entries: Record<string, string>,
): Promise<Record<string, string>> {
  const system =
    "You are a professional UI translator for a calm, premium sleep & meditation app. " +
    "Translate every value into the target language. Keep tone gentle, minimal, and friendly. " +
    "Preserve placeholders like {n}, {h}, {time} EXACTLY. " +
    "Do not translate brand names (SleepFlow, MoodBeats). " +
    "Return ONLY a JSON object mapping the original keys to translated strings — no commentary, no markdown.";

  const user = `Target locale: ${locale}\n\nTranslate this JSON dictionary:\n${JSON.stringify(entries)}`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI gateway ${res.status}: ${text}`);
  }

  const data = await res.json();
  const content: string = data?.choices?.[0]?.message?.content ?? "{}";
  let parsed: Record<string, unknown> = {};
  try {
    parsed = JSON.parse(content);
  } catch {
    // Strip code fences if the model wrapped its response.
    const cleaned = content.replace(/^```(?:json)?\s*|\s*```$/g, "");
    parsed = JSON.parse(cleaned);
  }
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(parsed)) {
    if (typeof v === "string") out[k] = v;
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY missing" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { locale, entries } = (await req.json()) as {
      locale?: string;
      entries?: Record<string, string>;
    };

    if (!locale || !entries || typeof entries !== "object") {
      return new Response(
        JSON.stringify({ error: "locale and entries are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const keys = Object.keys(entries);
    if (keys.length === 0) {
      return new Response(
        JSON.stringify({ translations: {} }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Translate in chunks (parallelized).
    const chunks = chunk(keys, CHUNK_SIZE);
    const results = await Promise.all(
      chunks.map((ks) => {
        const slice: Record<string, string> = {};
        for (const k of ks) slice[k] = entries[k];
        return translateChunk(locale, slice).catch((err) => {
          console.error("[translate-locale] chunk failed:", err.message);
          return {} as Record<string, string>;
        });
      }),
    );

    const translations: Record<string, string> = {};
    for (const r of results) Object.assign(translations, r);

    // Upsert into the translations table.
    const rows = Object.entries(translations).map(([key, value]) => ({
      locale,
      key,
      value,
    }));

    if (rows.length > 0) {
      const { error: upsertErr } = await admin
        .from("translations")
        .upsert(rows, { onConflict: "locale,key" });
      if (upsertErr) {
        console.error("[translate-locale] upsert error:", upsertErr.message);
      }
    }

    return new Response(JSON.stringify({ translations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[translate-locale] fatal:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
