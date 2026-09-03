import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { PAPERS } from "@/data/papers";
import { t } from "@/data/i18n";
import { useHub, unitKey } from "@/lib/store";
import { Page } from "@/components/layout/app-shell";

export const Route = createFileRoute("/notes")({ component: NotesIndex });

function NotesIndex() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/notes") return <Outlet />;

  const lang = useHub((s) => s.lang);
  const completed = useHub((s) => s.completed);
  const ui = t(lang);

  return (
    <Page kicker={ui.nav.notes} title={lang === "hi" ? "यूनिट-वार नोट्स" : "Unit-wise notes"} description={ui.heroP}>
      <div className="grid gap-3 sm:grid-cols-2">
        {PAPERS.map((p) => {
          const done = p.units.filter((u) => completed.includes(unitKey(p.id, u.id))).length;
          return (
            <Link
              key={p.id}
              to="/notes/$paperId"
              params={{ paperId: p.id }}
              className="rounded-[24px] bg-surface p-5 shadow-[var(--shadow-border)]"
            >
              <p className="text-[11px] font-semibold tracking-[0.14em] text-forest uppercase">
                {lang === "hi" ? p.labelHi : p.label}
              </p>
              <h2 className="mt-2 font-display text-2xl text-ink">{lang === "hi" ? p.titleHi : p.title}</h2>
              <p className="mt-2 text-sm text-muted">{p.meta}</p>
              <p className="mt-4 text-xs text-faint tabular-nums">
                {done}/{p.units.length} {ui.completed.toLowerCase()}
              </p>
            </Link>
          );
        })}
      </div>
    </Page>
  );
}
