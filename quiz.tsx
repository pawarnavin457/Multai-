import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PAPERS } from "@/data/papers";
import { quizFor } from "@/data/quiz";
import { t } from "@/data/i18n";
import { useHub } from "@/lib/store";
import { Page } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PaperId, QuizItem } from "@/data/types";

export const Route = createFileRoute("/quiz")({ component: QuizPage });

function QuizPage() {
  const lang = useHub((s) => s.lang);
  const ui = t(lang);
  const addXp = useHub((s) => s.addXp);
  const setBest = useHub((s) => s.setBest);
  const [paper, setPaper] = useState<PaperId | "all">("major1");
  const [running, setRunning] = useState(false);
  const [qs, setQs] = useState<QuizItem[]>([]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(30);
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");

  const start = () => {
    const list = quizFor(paper).slice(0, 12);
    setQs(list);
    setI(0);
    setScore(0);
    setPicked(null);
    setLeft(30);
    setDone(false);
    setRunning(true);
  };

  const finish = (finalScore: number) => {
    setRunning(false);
    setDone(true);
    setScore(finalScore);
    addXp(finalScore);
    setBest("quiz", finalScore);
  };

  useEffect(() => {
    if (!running) return;
    const tmr = window.setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          window.clearInterval(tmr);
          setPicked((p) => (p === null ? -1 : p));
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(tmr);
  }, [running, i]);

  const q = qs[i];
  const total = qs.length * 10;

  const next = () => {
    const add = picked === q?.answer ? 10 : 0;
    const nextScore = score + add;
    if (i + 1 >= qs.length) finish(nextScore);
    else {
      setScore(nextScore);
      setI((n) => n + 1);
      setPicked(null);
      setLeft(30);
    }
  };

  const paperLabel = useMemo(() => {
    if (paper === "all") return lang === "hi" ? "सभी पेपर" : "All papers";
    const p = PAPERS.find((x) => x.id === paper);
    return p ? (lang === "hi" ? p.labelHi : p.label) : "";
  }, [paper, lang]);

  return (
    <Page kicker={ui.nav.quiz} title={ui.quizTitle} description={ui.quizP}>
      {!running && !done ? (
        <>
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
          <Button size="lg" onClick={start}>
            {ui.startQuiz}
          </Button>
        </>
      ) : null}

      {running && q ? (
        <div className="mx-auto max-w-xl rounded-[24px] bg-surface p-5 shadow-[var(--shadow-border)] sm:p-7">
          <div className="flex items-center justify-between text-xs font-medium text-muted tabular-nums">
            <span>
              {i + 1} / {qs.length}
            </span>
            <span className={left <= 8 ? "text-danger" : ""}>{left}s</span>
            <span>
              {score} {ui.score.toLowerCase()}
            </span>
          </div>
          <h2 className="mt-4 font-display text-2xl text-ink">{q.question}</h2>
          <div className="mt-5 grid gap-2">
            {q.options.map((opt, idx) => {
              const show = picked !== null || left === 0;
              const ok = idx === q.answer;
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={show}
                  onClick={() => setPicked(idx)}
                  className={cn(
                    "rounded-xl border px-3 py-3 text-left text-sm",
                    show && ok && "border-ok bg-leaf text-ok",
                    show && picked === idx && !ok && "border-danger text-danger",
                    !show && picked === idx && "border-forest bg-leaf",
                    !show && picked !== idx && "border-line bg-surface-2 hover:border-forest",
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          <Button className="mt-5" disabled={picked === null && left > 0} onClick={next}>
            {i + 1 >= qs.length ? ui.submit : ui.next}
          </Button>
        </div>
      ) : null}

      {done ? (
        <div className="mx-auto max-w-xl">
          <div className="rounded-[24px] bg-ink px-6 py-8 text-center text-bg">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-sage uppercase">Botany Hub Multai</p>
            <h2 className="mt-3 font-display text-3xl">Certificate of practice</h2>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === "hi" ? "अपना नाम लिखें" : "Your name"}
              className="mt-6 h-11 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-center text-bg outline-none placeholder:text-bg/40"
            />
            <p className="mt-4 font-display text-2xl">{name || "Student"}</p>
            <p className="mt-1 text-sm text-bg/70">{paperLabel}</p>
            <p className="mt-4 font-display text-4xl text-sage tabular-nums">
              {score} / {total}
            </p>
            <p className="mt-2 text-xs text-bg/50">Practice certificate · not an official university document</p>
          </div>
          <Button className="mt-5" onClick={start}>
            {ui.startQuiz}
          </Button>
        </div>
      ) : null}
    </Page>
  );
}
