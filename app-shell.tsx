import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Boxes, FileText, Gamepad2, Menu, Search, Sparkles, X } from "lucide-react";
import { t } from "@/data/i18n";
import { useHub } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { SearchOverlay } from "@/components/search-overlay";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/notes", key: "notes" as const, icon: BookOpen },
  { to: "/syllabus", key: "syllabus" as const, icon: FileText },
  { to: "/models", key: "models" as const, icon: Boxes },
  { to: "/pdfs", key: "pdfs" as const, icon: FileText },
  { to: "/games", key: "games" as const, icon: Gamepad2 },
  { to: "/quiz", key: "quiz" as const, icon: Sparkles },
];

function Brand() {
  const lang = useHub((s) => s.lang);
  const ui = t(lang);
  return (
    <Link to="/" className="flex items-baseline gap-1.5 shrink-0">
      <span className="font-display text-[1.35rem] font-medium tracking-tight text-ink">{ui.brand}</span>
      <span className="font-display text-[1.35rem] font-medium tracking-tight text-forest">{ui.place}</span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const lang = useHub((s) => s.lang);
  const setLang = useHub((s) => s.setLang);
  const ui = t(lang);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-line bg-[color-mix(in_oklab,var(--color-bg)_88%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            className="grid size-10 place-items-center rounded-xl border border-line bg-surface md:hidden"
            aria-label={ui.menu}
            onClick={() => setMenu((v) => !v)}
          >
            {menu ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
          <Brand />
          <nav className="ml-4 hidden min-w-0 flex-1 items-center gap-0.5 md:flex">
            {LINKS.map((l) => {
              const active = pathname === l.to || pathname.startsWith(l.to + "/");
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "rounded-full px-3 py-2 text-[13px] font-medium text-muted transition-colors duration-150",
                    active ? "bg-leaf text-forest" : "hover:bg-surface-2 hover:text-ink",
                  )}
                >
                  {ui.nav[l.key]}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearch(true)}
              className="grid size-10 place-items-center rounded-xl border border-line bg-surface text-ink-soft hover:border-line-strong"
              aria-label={ui.searchBtn}
            >
              <Search className="size-4" />
            </button>
            <div className="flex rounded-full border border-line bg-surface p-0.5">
              {(["en", "hi"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={cn(
                    "h-8 min-w-9 rounded-full px-2.5 text-xs font-semibold",
                    lang === code ? "bg-forest text-surface" : "text-muted",
                  )}
                >
                  {code === "en" ? "EN" : "हिं"}
                </button>
              ))}
            </div>
          </div>
        </div>
        {menu ? (
          <div className="border-t border-line bg-surface px-4 py-3 md:hidden">
            <div className="grid grid-cols-2 gap-1.5">
              {LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMenu(false)}
                  className={cn(
                    "flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium",
                    pathname.startsWith(l.to) ? "bg-leaf text-forest" : "bg-bg-deep text-ink-soft",
                  )}
                >
                  <l.icon className="size-4" />
                  {ui.nav[l.key]}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </header>
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
      {children}
      <footer className="border-t border-line px-4 py-10 text-center">
        <p className="font-display text-lg text-ink">
          {ui.brand} {ui.place}
        </p>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted">{ui.footer}</p>
        <div className="mt-6">
          <Button variant="ghost" size="sm" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            {ui.back}
          </Button>
        </div>
      </footer>
    </div>
  );
}

export function Page({
  kicker,
  title,
  description,
  children,
  actions,
}: {
  kicker?: string;
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          {kicker ? (
            <p className="text-[11px] font-semibold tracking-[0.16em] text-forest uppercase">{kicker}</p>
          ) : null}
          <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">{title}</h1>
          {description ? <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">{description}</p> : null}
        </div>
        {actions}
      </div>
      {children}
    </main>
  );
}
