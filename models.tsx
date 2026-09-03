import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MODELS } from "@/data/models";
import { PAPERS } from "@/data/papers";
import { t } from "@/data/i18n";
import { useHub } from "@/lib/store";
import { Page } from "@/components/layout/app-shell";
import { ModelViewer } from "@/components/model-viewer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Model, PaperId } from "@/data/types";

export const Route = createFileRoute("/models")({ component: ModelsPage });

function ModelsPage() {
  const lang = useHub((s) => s.lang);
  const ui = t(lang);
  const [paper, setPaper] = useState<PaperId | "all">("all");
  const [active, setActive] = useState<Model | null>(null);
  const list = useMemo(
    () => (paper === "all" ? MODELS : MODELS.filter((m) => m.papers.includes(paper))),
    [paper],
  );

  return (
    <Page kicker="3D" title={ui.modelsTitle} description={ui.modelsP}>
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setPaper("all")}
          className={cn(
            "h-10 rounded-full px-4 text-sm font-medium",
            paper === "all" ? "bg-forest text-surface" : "bg-surface text-muted shadow-[var(--shadow-border)]",
          )}
        >
          {ui.allPapers}
        </button>
        {PAPERS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPaper(p.id)}
            className={cn(
              "h-10 rounded-full px-4 text-sm font-medium",
              paper === p.id ? "bg-forest text-surface" : "bg-surface text-muted shadow-[var(--shadow-border)]",
            )}
          >
            {lang === "hi" ? p.labelHi : p.label}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((m) => (
          <article key={m.id} className="overflow-hidden rounded-[24px] bg-surface shadow-[var(--shadow-border)]">
            <img src={m.thumb} alt="" className="h-44 w-full object-cover" crossOrigin="anonymous" />
            <div className="p-4">
              <h3 className="font-display text-xl text-ink">{lang === "hi" ? m.nameHi : m.name}</h3>
              <p className="mt-1 text-sm text-muted">{m.blurb}</p>
              <p className="mt-2 text-xs text-faint">{m.creator}</p>
              <Button className="mt-4" size="sm" onClick={() => setActive(m)}>
                {ui.openModel}
              </Button>
            </div>
          </article>
        ))}
      </div>
      <ModelViewer model={active} onClose={() => setActive(null)} />
    </Page>
  );
}
