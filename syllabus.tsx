import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PAPERS } from "@/data/papers";
import { EXPECTED } from "@/data/plan";
import { t } from "@/data/i18n";
import { useHub } from "@/lib/store";
import { Page } from "@/components/layout/app-shell";
import { cn } from "@/lib/utils";
import type { PaperId } from "@/data/types";

export const Route = createFileRoute("/syllabus")({ component: SyllabusPage });

function SyllabusPage() {
  const lang = useHub((s) => s.lang);
  const year = useHub((s) => s.year);
  const ui = t(lang);
  const [id, setId] = useState<PaperId>("major1");
  const paper = PAPERS.find((p) => p.id === id)!;

  return (
    <Page kicker={ui.nav.syllabus} title={lang === "hi" ? "पाठ्यक्रम" : "Syllabus"} description={paper.meta}>
      {year !== "1" ? <p className="mb-6 rounded-xl bg-leaf px-4 py-3 text-sm text-forest">{ui.coming}</p> : null}
      <div className="mb-6 flex flex-wrap gap-2">
        {PAPERS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setId(p.id)}
            className={cn(
              "h-10 rounded-full px-4 text-sm font-medium",
              p.id === id ? "bg-forest text-surface" : "bg-surface text-muted shadow-[var(--shadow-border)]",
            )}
          >
            {lang === "hi" ? p.labelHi : p.label}
          </button>
        ))}
      </div>
      <h2 className="font-display text-3xl text-ink">{lang === "hi" ? paper.titleHi : paper.title}</h2>
      <div className="mt-6 grid gap-3">
        {paper.units.map((u) => (
          <article key={u.id} className="rounded-2xl bg-surface p-5 shadow-[var(--shadow-border)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.14em] text-forest uppercase">{u.roman}</p>
                <h3 className="mt-1 font-display text-xl">{lang === "hi" && u.titleHi ? u.titleHi : u.title}</h3>
              </div>
              <Link
                to="/notes/$paperId/$unitId"
                params={{ paperId: paper.id, unitId: u.id }}
                className="text-sm font-medium text-forest"
              >
                {ui.openUnit}
              </Link>
            </div>
            <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
              {u.topics.map((tpc) => (
                <li key={tpc.code} className="flex gap-2">
                  <span className="text-faint tabular-nums">{tpc.code}</span>
                  {lang === "hi" && tpc.titleHi ? tpc.titleHi : tpc.title}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <h2 className="mt-12 font-display text-3xl text-ink">
        {lang === "hi" ? "अपेक्षित प्रश्न" : "Expected questions"}
      </h2>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Practice prompts from high-value syllabus topics. Not official or leaked papers.
      </p>
      <div className="mt-4 grid gap-2">
        {EXPECTED.map((e) => (
          <div key={e.q} className="rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-forest uppercase">
              {e.paper} · {e.kind}
            </p>
            <p className="mt-1 text-sm text-ink">{e.q}</p>
          </div>
        ))}
      </div>
    </Page>
  );
}
