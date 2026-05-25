import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  useNavigate,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { BottomNav } from "@/components/BottomNav";
import { MiniPlayer } from "@/components/MiniPlayer";
import { useSleepProfile } from "@/lib/sleep-profile";
import { useLang } from "@/lib/i18n";
import { ensureTranslations } from "@/i18n/translate";
import { appStore } from "@/lib/app-store";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SleepFlow" },
      { name: "description", content: "AI-powered sleep app with relaxing music, sleep tips and smart relaxation tools for better rest." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "SleepFlow" },
      { property: "og:description", content: "AI-powered sleep app with relaxing music, sleep tips and smart relaxation tools for better rest." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "SleepFlow" },
      { name: "twitter:description", content: "AI-powered sleep app with relaxing music, sleep tips and smart relaxation tools for better rest." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c13c5448-ece4-4b33-b7a8-f4e752009000/id-preview-6f49c4f5--5a275b38-0085-4dd4-bec5-9ed4986ea1da.lovable.app-1778409432294.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c13c5448-ece4-4b33-b7a8-f4e752009000/id-preview-6f49c4f5--5a275b38-0085-4dd4-bec5-9ed4986ea1da.lovable.app-1778409432294.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const nav = useNavigate();
  const profile = useSleepProfile();
  const lang = useLang();
  const isOnboarding = location.pathname === "/onboarding";

  useEffect(() => {
    if (!profile.onboarded && !isOnboarding) {
      nav({ to: "/onboarding", replace: true });
    }
  }, [profile.onboarded, isOnboarding, nav]);

  // Load AI translations whenever the active language is non-built-in
  // and the user has AI auto-translate enabled.
  useEffect(() => {
    if (!appStore.get().autoTranslate) return;
    void ensureTranslations(lang);
  }, [lang]);

  // Register the audio Service Worker (caches CDN audio only).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/audio-sw.js", { scope: "/" })
      .catch((err) => console.warn("[audio-sw] registration failed", err));
  }, []);


  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground max-w-md mx-auto relative">
        <main className={isOnboarding ? "min-h-screen px-5 pt-6 pb-6" : "pb-40 pt-6 px-5"}>
          {!profile.onboarded && !isOnboarding ? null : <Outlet />}
        </main>
        {!isOnboarding && profile.onboarded && (
          <>
            <MiniPlayer />
            <BottomNav />
          </>
        )}
      </div>
    </QueryClientProvider>
  );
}
