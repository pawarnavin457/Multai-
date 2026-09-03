import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { QUIZ, shuffle } from "@/data/quiz";
import { Button } from "@/components/ui/button";
import { useHub } from "@/lib/store";
import { cn } from "@/lib/utils";

type GameId = "hunter" | "evolution" | "rush";

const PARTS = [
  { id: "root", label: "Root", cx: 160, cy: 430, hint: "absorbs water" },
  { id: "stem", label: "Stem", cx: 160, cy: 250, hint: "axis of the shoot" },
  { id: "leaf", label: "Leaf", cx: 250, cy: 170, hint: "photosynthetic organ" },
  { id: "flower", label: "Flower", cx: 168, cy: 72, hint: "sexual reproduction" },
  { id: "fruit", label: "Fruit", cx: 78, cy: 150, hint: "ripened ovary" },
] as const;

const EVOLUTION = ["Algae", "Bryophytes", "Pteridophytes", "Gymnosperms", "Angiosperms"];

function Overlay({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[color-mix(in_oklab,var(--color-ink)_50%,transparent)] p-3" onClick={onClose}>
      <div
        className="max-h-[min(90dvh,720px)] w-full max-w-lg overflow-auto rounded-2xl bg-surface p-5 shadow-[var(--shadow-border)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="font-display text-2xl text-ink">{title}</h2>
          <button type="button" className="grid size-10 place-items-center rounded-xl hover:bg-leaf" onClick={onClose} aria-label="Close">
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Rush({ onDone }: { onDone: (score: number) => void }) {
  const qs = useMemo(() => shuffle(QUIZ).slice(0, 10), []);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(60);
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    const t = window.setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          window.clearInterval(t);
          onDone(score);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [onDone, score]);

  const q = qs[i];
  if (!q || left <= 0) return null;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-xs font-medium text-muted tabular-nums">
        <span>
          Q {i + 1} / {qs.length}
        </span>
        <span>{left}s</span>
        <span>{score} pts</span>
      </div>
      <p className="font-display text-xl text-ink">{q.question}</p>
      <div className="mt-4 grid gap-2">
        {q.options.map((opt, idx) => {
          const show = picked !== null;
          const ok = idx === q.answer;
          return (
            <button
              key={opt}
              type="button"
              disabled={picked !== null}
              onClick={() => {
                setPicked(idx);
                const add = idx === q.answer ? 10 : 0;
                window.setTimeout(() => {
                  if (i + 1 >= qs.length) onDone(score + add);
                  else {
                    setScore((s) => s + add);
                    setPicked(null);
                    setI((n) => n + 1);
                  }
                }, 550);
              }}
              className={cn(
                "rounded-xl border px-3 py-3 text-left text-sm",
                show && ok && "border-ok bg-leaf text-ok",
                show && picked === idx && !ok && "border-danger bg-[color-mix(in_oklab,var(--color-danger)_10%,white)] text-danger",
                !show && "border-line bg-surface-2 text-ink hover:border-forest",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Hunter({ onDone }: { onDone: (score: number) => void }) {
  const order = useMemo(() => shuffle([...PARTS]), []);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState("Tap the named organ on the plant.");
  const target = order[i];

  if (!target) return null;

  return (
    <div>
      <p className="text-sm text-muted">
        Find: <span className="font-semibold text-forest">{target.label}</span>
        <span className="ml-2 tabular-nums">
          {i + 1}/{order.length} · {score} XP
        </span>
      </p>
      <svg viewBox="0 0 320 500" className="mx-auto mt-3 w-full max-w-[280px]">
        <rect width="320" height="500" rx="24" fill="#ebe4d4" />
        <ellipse cx="160" cy="455" rx="70" ry="18" fill="#c9b896" />
        <path d="M160 430 C150 340 148 250 160 120" stroke="#2e5a3c" strokeWidth="14" fill="none" strokeLinecap="round" />
        <path d="M160 430 C140 460 120 480 100 492" stroke="#6b5420" strokeWidth="8" fill="none" />
        <path d="M160 430 C180 460 200 480 220 492" stroke="#6b5420" strokeWidth="8" fill="none" />
        <path d="M160 430 C160 470 160 488 160 498" stroke="#6b5420" strokeWidth="8" fill="none" />
        <ellipse cx="232" cy="188" rx="54" ry="28" transform="rotate(-18 232 188)" fill="#4a7a55" />
        <ellipse cx="88" cy="210" rx="48" ry="24" transform="rotate(22 88 210)" fill="#4a7a55" />
        <circle cx="78" cy="150" r="22" fill="#9b3a3a" />
        <circle cx="168" cy="72" r="26" fill="#c45c6a" />
        <circle cx="156" cy="64" r="8" fill="#f3efe4" />
        {PARTS.map((p) => (
          <g key={p.id}>
            <circle
              cx={p.cx}
              cy={p.cy}
              r="28"
              fill="transparent"
              className="cursor-pointer"
              onClick={() => {
                if (p.id === target.id) {
                  const next = score + 20;
                  setScore(next);
                  setMsg("Correct.");
                  window.setTimeout(() => {
                    if (i + 1 >= order.length) onDone(next);
                    else setI((n) => n + 1);
                  }, 400);
                } else {
                  setMsg(`Not the ${p.label.toLowerCase()}. Look for the ${target.hint}.`);
                }
              }}
            />
            <circle cx={p.cx} cy={p.cy} r="5" fill="#fbf8f0" opacity="0.9" />
          </g>
        ))}
      </svg>
      <p className="mt-2 text-center text-sm text-ink-soft">{msg}</p>
    </div>
  );
}

function Evolution({ onDone }: { onDone: (score: number) => void }) {
  const choices = useMemo(() => shuffle([...EVOLUTION]), []);
  const [step, setStep] = useState(0);
  const [used, setUsed] = useState<string[]>([]);
  const [msg, setMsg] = useState("Tap groups from lower to higher plants.");

  return (
    <div>
      <div className="mb-4 flex min-h-12 flex-wrap gap-2">
        {used.map((n) => (
          <span key={n} className="rounded-full bg-leaf px-3 py-1.5 text-xs font-semibold text-forest">
            {n}
          </span>
        ))}
      </div>
      <div className="grid gap-2">
        {choices.map((name) => {
          const locked = used.includes(name);
          return (
            <button
              key={name}
              type="button"
              disabled={locked}
              onClick={() => {
                if (name === EVOLUTION[step]) {
                  const next = [...used, name];
                  setUsed(next);
                  setStep(step + 1);
                  setMsg("Correct step.");
                  if (step + 1 >= EVOLUTION.length) onDone(80);
                } else {
                  setMsg("Not next. Think of the land-plant series.");
                }
              }}
              className={cn(
                "rounded-xl border px-3 py-3 text-left text-sm font-medium",
                locked ? "border-ok bg-leaf text-ok" : "border-line bg-surface-2 text-ink hover:border-forest",
              )}
            >
              {name}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-muted">{msg}</p>
    </div>
  );
}

export function GameArena() {
  const [game, setGame] = useState<GameId | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const addXp = useHub((s) => s.addXp);
  const setBest = useHub((s) => s.setBest);
  const best = useHub((s) => s.best);
  const xp = useHub((s) => s.xp);

  const finish = (score: number) => {
    setResult(score);
    addXp(score);
    if (game) setBest(game, score);
  };

  const cards: Array<{ id: GameId; title: string; blurb: string; xp: string }> = [
    { id: "hunter", title: "Plant Part Hunter", blurb: "Tap the correct organ on a living plant diagram.", xp: "100 XP" },
    { id: "evolution", title: "Evolution Trail", blurb: "Order the major plant groups from lower to higher.", xp: "80 XP" },
    { id: "rush", title: "60-Second Botany Rush", blurb: "Ten syllabus MCQs against a one-minute clock.", xp: "100 XP" },
  ];

  return (
    <>
      <div className="mb-4 flex items-center justify-between text-sm text-muted">
        <span>
          Total XP <strong className="text-ink tabular-nums">{xp}</strong>
        </span>
        <span>Stored on this device</span>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {cards.map((c) => (
          <article key={c.id} className="flex flex-col rounded-2xl bg-surface p-5 shadow-[var(--shadow-border)]">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-forest uppercase">{c.xp}</p>
            <h3 className="mt-2 font-display text-2xl text-ink">{c.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{c.blurb}</p>
            <p className="mt-3 text-xs text-faint">
              Best <span className="tabular-nums text-ink-soft">{best[c.id] ?? 0}</span>
            </p>
            <Button className="mt-4" onClick={() => { setResult(null); setGame(c.id); }}>
              Play
            </Button>
          </article>
        ))}
      </div>
      {game ? (
        <Overlay
          title={cards.find((c) => c.id === game)?.title ?? "Game"}
          onClose={() => {
            setGame(null);
            setResult(null);
          }}
        >
          {result !== null ? (
            <div>
              <p className="font-display text-4xl text-forest tabular-nums">{result}</p>
              <p className="mt-1 text-sm text-muted">XP earned this round</p>
              <Button className="mt-5" onClick={() => setResult(null)}>
                Play again
              </Button>
            </div>
          ) : game === "rush" ? (
            <Rush onDone={finish} />
          ) : game === "hunter" ? (
            <Hunter onDone={finish} />
          ) : (
            <Evolution onDone={finish} />
          )}
        </Overlay>
      ) : null}
    </>
  );
}
