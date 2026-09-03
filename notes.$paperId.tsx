import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { PAPERS, getPaper } from "@/data/papers";
import { t } from "@/data/i18n";
import { useHub, unitKey } from "@/lib/store";
import { Page } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PaperId } from "@/data/types";

export const Route = createFileRoute("/notes/$paperId")({ component: PaperNotes });

function PaperNotes() {
  const { paperId } = Route.useParams();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const paper = getPaper(paperId as PaperId);
  const nested = pathname.split("/").length > 3;
  if (nested) return <Outlet />;
  if (!paper) {
    return (
      <Page title="Paper not found">
        <Link to="/notes">Back</Link>
      </Page>
    );
  }

  const lang = useHub((s) => s.lang);
  const completed = useHub((s) => s.completed);
  const ui = t(lang);

  return (
    <Page
      kicker={lang === "hi" ? paper.labelHi : paper.label}
      title={lang === "hi" ? paper.titleHi : paper.title}
      description={paper.meta}
      actions={
        <Link to="/notes">
          <Button variant="secondary">{ui.back}</Button>
        </Link>
      }
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {PAPERS.map((p) => (
          <Link
            key={p.id}
            to="/notes/$paperId"
            params={{ paperId: p.id }}
            className={cn(
              "h-10 rounded-full px-4 text-sm font-medium leading-10",
              p.id === paper.id ? "bg-forest text-surface" : "bg-surface text-muted shadow-[var(--shadow-border)]",
            )}
          >
            {lang === "hi" ? p.labelHi : p.label}
          </Link>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {paper.units.map((u) => {
          const done = completed.includes(unitKey(paper.id, u.id));
          return (
            <Link
              key={u.id}
              to="/notes/$paperId/$unitId"
              params={{ paperId: paper.id, unitId: u.id }}
              className="overflow-hidden rounded-[24px] bg-surface shadow-[var(--shadow-border)]"
            >
              <img src={u.image} alt="" className="h-36 w-full object-cover" crossOrigin="anonymous" />
              <div className="p-4">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-forest uppercase">{u.roman}</p>
                <h3 className="mt-1 font-display text-xl text-ink">{lang === "hi" && u.titleHi ? u.titleHi : u.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{u.subtitle}</p>
                <p className="mt-3 text-xs text-faint">
                  {u.topics.length} {ui.topics.toLowerCase()}
                  {done ? ` · ${ui.completed}` : ""}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </Page>
  );
}
