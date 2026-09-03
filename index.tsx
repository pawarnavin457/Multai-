import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Boxes, FileText, Sparkles } from "lucide-react";
import { PAPERS, TOTAL_UNITS } from "@/data/papers";
import { MODELS } from "@/data/models";
import { QUIZ } from "@/data/quiz";
import { t } from "@/data/i18n";
import { useHub, unitKey } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const lang = useHub((s) => s.lang);
  const year = useHub((s) => s.year);
  const setYear = useHub((s) => s.setYear);
  const completed = useHub((s) => s.completed);
  const xp = useHub((s) => s.xp);
  const ui = t(lang);

  const done = completed.length;
  const pct = Math.round((done / TOTAL_UNITS) * 100);

  return (
    <main>
      <section className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-forest uppercase">{ui.kicker}</p>
          <h1 className="mt-4 font-display text-[clamp(2.6rem,7vw,5.4rem)] leading-[0.95] font-medium tracking-tight text-ink">
            {ui.heroA}
            <span className="block text-ink-soft">{ui.heroB}</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{ui.heroP}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/notes">
              <Button size="lg">
                {ui.start}
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link to="/quiz">
              <Button size="lg" variant="secondary">
                {ui.quizCta}
              </Button>
            </Link>
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              [String(TOTAL_UNITS), ui.units],
              [String(MODELS.length), "3D models"],
              [String(QUIZ.length), "MCQs"],
              ["5", lang === "hi" ? "पेपर" : "Papers"],
            ].map(([n, l]) => (
              <div key={l} className="rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]">
                <dt className="text-xs text-muted">{l}</dt>
                <dd className="font-display text-2xl text-forest tabular-nums">{n}</dd>
              </div>
            ))}
          </dl>
        </div>
        <figure className="relative overflow-hidden rounded-[28px] bg-ink shadow-[var(--shadow-border)]">
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80"
            alt="Forest canopy used as a botanical study image"
            className="h-[420px] w-full object-cover opacity-90 sm:h-[520px]"
            crossOrigin="anonymous"
          />
          <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl bg-[color-mix(in_oklab,var(--color-ink)_72%,transparent)] p-4 text-bg backdrop-blur-sm">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-sage uppercase">Barkatullah University</p>
            <p className="mt-1 font-display text-2xl">B.Sc. I Year Botany</p>
            <p className="text-sm text-bg/70">Major I–III · Minor I–II · 2026–27</p>
          </figcaption>
        </figure>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="rounded-[28px] bg-surface p-5 shadow-[var(--shadow-border)] sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.14em] text-forest uppercase">{ui.year}</p>
              <h2 className="font-display text-2xl text-ink">{ui.progress}</h2>
            </div>
            <div className="flex rounded-full bg-bg-deep p-1">
              {(["1", "2", "3"] as const).map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYear(y)}
                  className={cn(
                    "h-10 rounded-full px-4 text-sm font-medium",
                    year === y ? "bg-forest text-surface" : "text-muted",
                  )}
                >
                  {y === "1" ? ui.year1 : y === "2" ? ui.year2 : ui.year3}
                </button>
              ))}
            </div>
          </div>
          {year !== "1" ? (
            <p className="mt-4 rounded-xl bg-leaf px-4 py-3 text-sm text-forest">{ui.coming}</p>
          ) : (
            <>
              <div className="mt-5 flex items-center gap-4">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg-deep">
                  <div className="h-full bg-forest transition-[width] duration-300" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-sm font-medium text-ink-soft tabular-nums">
                  {done}/{TOTAL_UNITS}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted">
                {xp} {ui.xp} · {pct}% {ui.completed.toLowerCase()}
              </p>
            </>
          )}
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-[1200px] px-4 sm:px-6">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-display text-3xl text-ink">{lang === "hi" ? "पेपर चुनें" : "Choose a paper"}</h2>
          <Link to="/syllabus" className="text-sm font-medium text-forest">
            {ui.nav.syllabus}
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PAPERS.map((p) => {
            const doneN = p.units.filter((u) => completed.includes(unitKey(p.id, u.id))).length;
            return (
              <Link
                key={p.id}
                to="/notes/$paperId"
                params={{ paperId: p.id }}
                className="group rounded-[24px] bg-surface p-5 shadow-[var(--shadow-border)] transition-[transform] duration-150 hover:-translate-y-0.5"
              >
                <p className="text-[11px] font-semibold tracking-[0.14em] text-forest uppercase">
                  {lang === "hi" ? p.labelHi : p.label}
                </p>
                <h3 className="mt-2 font-display text-2xl text-ink">
                  {lang === "hi" ? p.titleHi : p.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{p.meta}</p>
                <p className="mt-4 text-xs text-faint tabular-nums">
                  {doneN}/{p.units.length} {ui.units.toLowerCase()}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-12 grid max-w-[1200px] gap-3 px-4 sm:grid-cols-3 sm:px-6">
        {[
          { to: "/models", icon: Boxes, title: ui.nav.models, body: ui.modelsP },
          { to: "/pdfs", icon: FileText, title: ui.nav.pdfs, body: ui.pdfP },
          { to: "/games", icon: Sparkles, title: ui.nav.games, body: ui.gamesP },
        ].map((c) => (
          <Link key={c.to} to={c.to} className="rounded-[24px] bg-ink p-5 text-bg">
            <c.icon className="size-5 text-sage" />
            <h3 className="mt-3 font-display text-2xl">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-bg/70">{c.body}</p>
          </Link>
        ))}
      </section>

      <section className="mx-auto my-14 max-w-[1200px] px-4 sm:px-6">
        <div className="overflow-hidden rounded-[28px] bg-forest px-6 py-8 text-surface sm:px-10">
          <p className="text-[11px] font-semibold tracking-[0.16em] uppercase opacity-80">
            {lang === "hi" ? "आभार" : "Acknowledgement"}
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">{ui.thanksTitle}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-surface/80 sm:text-base">{ui.thanksP}</p>
          <Link to="/notes" className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
            <BookOpen className="size-4" />
            {ui.start}
          </Link>
        </div>
      </section>
    </main>
  );
}
