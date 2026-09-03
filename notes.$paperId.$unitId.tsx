import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ChevronDown } from "lucide-react";
import { getPaper, getUnit } from "@/data/papers";
import { MODELS } from "@/data/models";
import { t } from "@/data/i18n";
import { useHub, unitKey } from "@/lib/store";
import { TopicBlocks } from "@/components/topic-blocks";
import { ModelViewer } from "@/components/model-viewer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Model, PaperId } from "@/data/types";

export const Route = createFileRoute("/notes/$paperId/$unitId")({ component: UnitPage });

function UnitPage() {
  const { paperId, unitId } = Route.useParams();
  const paper = getPaper(paperId as PaperId);
  const unit = getUnit(paperId as PaperId, unitId);
  const lang = useHub((s) => s.lang);
  const ui = t(lang);
  const completed = useHub((s) => s.completed);
  const toggle = useHub((s) => s.toggleComplete);
  const [open, setOpen] = useState<string | null>(null);
  const [model, setModel] = useState<Model | null>(null);

  if (!paper || !unit) {
    return (
      <main className="mx-auto max-w-[800px] px-4 py-16">
        <p>Unit not found.</p>
        <Link to="/notes">Back</Link>
      </main>
    );
  }

  const key = unitKey(paper.id, unit.id);
  const done = completed.includes(key);
  const related = MODELS.filter((m) => m.papers.includes(paper.id)).slice(0, 4);

  return (
    <main>
      <section className="relative h-[280px] overflow-hidden sm:h-[340px]">
        <img src={unit.image} alt="" className="h-full w-full object-cover" crossOrigin="anonymous" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(28,36,25,0.82))]" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[800px] px-4 pb-8">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-sage uppercase">
            {lang === "hi" ? paper.labelHi : paper.label} · {unit.roman}
          </p>
          <h1 className="mt-2 font-display text-4xl text-bg sm:text-5xl">
            {lang === "hi" && unit.titleHi ? unit.titleHi : unit.title}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-bg/75">{unit.subtitle}</p>
        </div>
      </section>

      <div className="mx-auto max-w-[800px] px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link to="/notes/$paperId" params={{ paperId: paper.id }}>
            <Button variant="secondary" size="sm">
              {ui.back}
            </Button>
          </Link>
          <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              className="sr-only"
              checked={done}
              onChange={() => toggle(key)}
            />
            <span
              className={cn(
                "grid size-5 place-items-center rounded-md border",
                done ? "border-forest bg-forest text-surface" : "border-line-strong bg-surface",
              )}
            >
              {done ? <Check className="size-3" /> : null}
            </span>
            {done ? ui.completed : ui.complete}
          </label>
        </div>

        {related.length ? (
          <div className="mb-8">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-forest uppercase">{ui.nav.models}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {related.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModel(m)}
                  className="overflow-hidden rounded-2xl bg-surface text-left shadow-[var(--shadow-border)]"
                >
                  <img src={m.thumb} alt="" className="h-20 w-full object-cover" crossOrigin="anonymous" />
                  <span className="block px-2 py-2 text-xs font-medium text-ink">
                    {lang === "hi" ? m.nameHi : m.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          {unit.topics.map((topic) => {
            const isOpen = open === topic.code;
            return (
              <article key={topic.code} className="rounded-2xl bg-surface shadow-[var(--shadow-border)]">
                <button
                  type="button"
                  className="flex w-full items-center gap-3 px-4 py-4 text-left"
                  onClick={() => setOpen(isOpen ? null : topic.code)}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-leaf font-display text-sm text-forest">
                    {topic.code}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg text-ink">
                      {lang === "hi" && topic.titleHi ? topic.titleHi : topic.title}
                    </span>
                    <span className="block text-sm text-muted">{topic.subtitle}</span>
                  </span>
                  <ChevronDown className={cn("size-4 text-muted transition-transform duration-200", isOpen && "rotate-180")} />
                </button>
                {isOpen ? (
                  <div className="border-t border-line px-4 py-5">
                    <TopicBlocks blocks={topic.blocks} diagram={topic.diagram} />
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
      <ModelViewer model={model} onClose={() => setModel(null)} />
    </main>
  );
}
