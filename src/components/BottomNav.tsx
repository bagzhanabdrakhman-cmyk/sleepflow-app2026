import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Moon, Heart, User } from "lucide-react";
import { useT } from "@/lib/i18n";

const items = [
  { to: "/", labelKey: "nav.home", icon: Home },
  { to: "/player", labelKey: "nav.sleep", icon: Moon },
  { to: "/favorites", labelKey: "nav.favorites", icon: Heart },
  { to: "/account", labelKey: "nav.account", icon: User },
] as const;

export function BottomNav() {
  const t = useT();
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path === "/onboarding" || path === "/player") return null;
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-t border-white/5 max-w-md mx-auto">
      <div className="flex items-center justify-around h-16 px-2 pb-1">
        {items.map(({ to, labelKey, icon: Icon }) => {
          const active = path === to;
          return (
            <Link
              key={to}
              to={to}
              className={`relative flex flex-col items-center gap-1 px-4 py-1.5 tap ${active ? "text-foreground" : "text-muted-foreground"}`}
            >
              {active && (
                <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-brand shadow-[0_0_8px_var(--brand)]" />
              )}
              <Icon className={`h-5 w-5 transition-all duration-300 ${active ? "scale-110" : ""}`} strokeWidth={active ? 2.5 : 2} />
              <span className={`text-[10px] tracking-wide ${active ? "font-semibold" : ""}`}>{t(labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
