import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { PAPERS } from "@/data/papers";
import { MODELS } from "@/data/models";
import { PDFS } from "@/data/pdfs";
import { t } from "@/data/i18n";
import { useHub } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lang = useHub((s) => s.lang);
  const ui = t(lang);
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (needle.length < 2) return [];
    const hits: Array<{ href: string; kicker: string; title: string }> = [];
    for (const paper of PAPERS) {
      for (const unit of paper.units) {
        for (const topic of unit.topics) {
          const hay = `${paper.title} ${unit.title} ${topic.title} ${topic.subtitle} ${topic.titleHi ?? ""}`.toLowerCase();
          if (hay.includes(needle)) {
            hits.push({
              href: `/notes/${paper.id}/${unit.id}`,
              kicker: `${paper.label} · ${unit.roman}`,
              title: lang === "hi" && topic.titleHi ? topic.titleHi : topic.title,
            });
          }
        }
      }
    }
    for (const model of MODELS) {
      if (`${model.name} ${model.nameHi} ${model.blurb}`.toLowerCase().includes(needle)) {
        hits.push({ href: "/models", kicker: "3D", title: lang === "hi" ? model.nameHi : model.name });
      }
    }
    for (const pdf of PDFS) {
      if (`${pdf.title} ${pdf.titleHi}`.toLowerCase().includes(needle)) {
        hits.push({ href: "/pdfs", kicker: "PDF", title: lang === "hi" ? pdf.titleHi : pdf.title });
      }
    }
    return hits.slice(0, 12);
  }, [q, lang]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-[color-mix(in_oklab,var(--color-ink)_40%,transparent)] p-3 pt-[max(12px,env(safe-area-inset-top))]" onClick={onClose}>
      <div
        className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-border)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-line px-3">
          <Search className="size-4 text-muted" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={ui.search}
            className="h-12 flex-1 bg-transparent text-[15px] outline-none placeholder:text-faint"
          />
          <Button variant="ghost" size="sm" onClick={onClose} aria-label={ui.close}>
            <X className="size-4" />
          </Button>
        </div>
        <div className="max-h-[min(60dvh,420px)] overflow-auto p-2">
          {q.trim().length >= 2 && results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted">{ui.noResults}</p>
          ) : (
            results.map((r) => (
              <Link
                key={r.href + r.title}
                to={r.href}
                onClick={onClose}
                className="block rounded-xl px-3 py-2.5 hover:bg-leaf"
              >
                <p className="text-[10px] font-semibold tracking-[0.14em] text-forest uppercase">{r.kicker}</p>
                <p className="text-sm text-ink">{r.title}</p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
