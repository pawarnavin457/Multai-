import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { PDFS } from "@/data/pdfs";
import { t } from "@/data/i18n";
import { useHub } from "@/lib/store";
import { Page } from "@/components/layout/app-shell";

export const Route = createFileRoute("/pdfs")({ component: PdfsPage });

const GROUPS = [
  { id: "major-syllabus" as const, en: "Major syllabus", hi: "मेजर सिलेबस" },
  { id: "minor-syllabus" as const, en: "Minor syllabus", hi: "माइनर सिलेबस" },
  { id: "major-notes" as const, en: "Major I notes PDFs", hi: "मेजर I नोट्स PDF" },
];

function PdfsPage() {
  const lang = useHub((s) => s.lang);
  const ui = t(lang);

  return (
    <Page kicker="PDF" title={ui.pdfTitle} description={ui.pdfP}>
      {GROUPS.map((g) => (
        <section key={g.id} className="mb-10">
          <h2 className="font-display text-2xl text-ink">{lang === "hi" ? g.hi : g.en}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {PDFS.filter((d) => d.group === g.id).map((d) => (
              <a
                key={d.id}
                href={d.file}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 rounded-[20px] bg-surface p-4 shadow-[var(--shadow-border)]"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-leaf text-forest">
                  <FileText className="size-5" />
                </span>
                <span>
                  <span className="block font-medium text-ink">{lang === "hi" ? d.titleHi : d.title}</span>
                  <span className="mt-1 block text-sm text-muted">{d.pagesHint}</span>
                  <span className="mt-2 inline-block text-xs font-semibold text-forest">{ui.openPdf}</span>
                </span>
              </a>
            ))}
          </div>
        </section>
      ))}
    </Page>
  );
}
