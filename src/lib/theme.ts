// Thin wrapper around the central app store for theme.
import { appStore, useAppStore, type Theme } from "./app-store";

export type { Theme };

export const themeStore = {
  get: () => appStore.get().theme,
  set: (t: Theme) => appStore.setTheme(t),
  subscribe: appStore.subscribe,
};

export function useTheme(): Theme {
  return useAppStore((s) => s.theme);
}
