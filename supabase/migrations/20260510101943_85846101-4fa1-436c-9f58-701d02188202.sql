
CREATE TABLE public.translations (
  locale TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (locale, key)
);

ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Translations are publicly readable"
  ON public.translations FOR SELECT
  USING (true);
