import type { NoteBlock } from "@/data/types";
import { t } from "@/data/i18n";
import { useHub } from "@/lib/store";

function CardCol({
  title,
  items,
  body,
}: {
  title: string;
  items?: string[];
  body?: string;
}) {
  return (
    <div className="rounded-xl bg-surface-2 p-4 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-ink)_8%,transparent)]">
      <h4 className="font-display text-base font-medium text-ink">{title}</h4>
      {body ? <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p> : null}
      {items?.length ? (
        <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-sage" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function TopicBlocks({ blocks, diagram }: { blocks: NoteBlock[]; diagram?: string | null }) {
  const lang = useHub((s) => s.lang);
  const ui = t(lang);

  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        if (block.type === "definition") {
          return (
            <aside
              key={i}
              className="rounded-r-xl border-l-[3px] border-forest bg-leaf px-4 py-3"
            >
              <p className="text-[11px] font-semibold tracking-[0.14em] text-forest uppercase">
                {block.title}
              </p>
              <p className="mt-1 text-[15px] leading-relaxed text-ink">{block.body}</p>
            </aside>
          );
        }
        if (block.type === "split") {
          return (
            <div key={i} className="grid gap-3 sm:grid-cols-2">
              <CardCol {...block.left} />
              <CardCol {...block.right} />
            </div>
          );
        }
        if (block.type === "card") {
          return <CardCol key={i} title={block.title} items={block.items} body={block.body} />;
        }
        if (block.type === "list") {
          return <CardCol key={i} title={block.title ?? ""} items={block.items} />;
        }
        if (block.type === "steps") {
          return (
            <ol key={i} className="space-y-2">
              {block.items.map((item, n) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-xl bg-surface-2 px-3 py-3 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-ink)_8%,transparent)]"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-forest text-xs font-semibold text-surface tabular-nums">
                    {n + 1}
                  </span>
                  <span className="pt-0.5 text-sm leading-relaxed text-ink-soft">{item}</span>
                </li>
              ))}
            </ol>
          );
        }
        if (block.type === "exam") {
          return (
            <div
              key={i}
              className="rounded-xl bg-[color-mix(in_oklab,var(--color-gold-ink)_8%,var(--color-surface))] px-4 py-3 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-gold-ink)_22%,transparent)]"
            >
              <p className="text-[11px] font-semibold tracking-[0.14em] text-gold-ink uppercase">
                {ui.examTip}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{block.body}</p>
            </div>
          );
        }
        return (
          <p key={i} className="text-[15px] leading-relaxed text-ink-soft">
            {block.body}
          </p>
        );
      })}
      {diagram ? (
        <p className="text-sm text-muted">
          <span className="font-medium text-ink-soft">{ui.diagram}: </span>
          {diagram}
        </p>
      ) : null}
    </div>
  );
}
