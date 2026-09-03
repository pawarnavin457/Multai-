import { createFileRoute, Link } from "@tanstack/react-router";
import { STUDY_PLAN } from "@/data/plan";
import { t } from "@/data/i18n";
import { useHub } from "@/lib/store";
import { Page } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/plan")({ component: PlanPage });

function PlanPage() {
  const lang = useHub((s) => s.lang);
  const ui = t(lang);
  return (
    <Page
      kicker={ui.nav.plan}
      title={lang === "hi" ? "दस-दिन परीक्षा योजना" : "Ten-day exam plan"}
      description={lang === "hi" ? "नोट्स पूरा करने के बाद यह क्रम अपनाएँ।" : "Use this sequence after the notes. Tick units as you go."}
    >
      <ol className="grid gap-3 sm:grid-cols-2">
        {STUDY_PLAN.map((d) => (
          <li key={d.day} className="rounded-[20px] bg-surface p-5 shadow-[var(--shadow-border)]">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-forest uppercase">Day {d.day}</p>
            <h3 className="mt-1 font-display text-xl text-ink">{d.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{d.focus}</p>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/notes">
          <Button>{ui.start}</Button>
        </Link>
        <Link to="/quiz">
          <Button variant="secondary">{ui.quizCta}</Button>
        </Link>
      </div>
    </Page>
  );
}
