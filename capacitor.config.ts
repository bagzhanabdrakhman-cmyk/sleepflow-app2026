import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor configuration for wrapping the SleepFlow web app as a native
 * Android (and iOS) application.
 *
 * IMPORTANT — Hybrid hosting model
 * --------------------------------
 * This project is a TanStack Start SSR app (server functions for Supabase
 * auth, AI translation, etc.). It is NOT a pure static SPA, so Capacitor
 * cannot package the entire backend inside the APK.
 *
 * Strategy:
 *   • The native shell loads the live web app from `server.url` (the
 *     published Lovable URL) inside the Android WebView.
 *   • The existing Service Worker (public/audio-sw.js) caches all audio
 *     assets after first play, giving full offline audio playback.
 *   • A tiny offline `index.html` (created by `npm run build:capacitor`,
 *     see CAPACITOR.md) is bundled into `webDir` as a fallback shell so
 *     the APK is still installable / launchable without network.
 *
 * If you ever want a fully offline-capable bundle you must first migrate
 * server functions away from `createServerFn` into a static build (or move
 * them to a hosted API the WebView calls).
 */
const config: CapacitorConfig = {
  appId: "app.lovable.sleepflow",
  appName: "SleepFlow",
  webDir: "dist-capacitor",
  bundledWebRuntime: false,

  server: {
    // Live SSR app served by Cloudflare Workers (Lovable publish).
    url: "https://dream-beats.lovable.app",
    androidScheme: "https",
    iosScheme: "https",
    // Allow mixed content only during local dev builds if you need to
    // point at http://10.0.2.2:8787 from the Android emulator.
    cleartext: false,
  },

  android: {
    allowMixedContent: false,
    // Enables chrome://inspect during development. Capacitor strips this
    // automatically in release builds.
    webContentsDebuggingEnabled: true,
    // Hardware acceleration is required for smooth audio + transitions.
    backgroundColor: "#0b0b14",
  },

  ios: {
    contentInset: "always",
    backgroundColor: "#0b0b14",
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 600,
      backgroundColor: "#0b0b14",
      androidSplashResourceName: "splash",
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0b0b14",
    },
  },
};

export default config;
