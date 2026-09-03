import { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import type { Model } from "@/data/types";
import { Button } from "@/components/ui/button";
import { t } from "@/data/i18n";
import { useHub } from "@/lib/store";

export function ModelViewer({
  model,
  onClose,
}: {
  model: Model | null;
  onClose: () => void;
}) {
  const lang = useHub((s) => s.lang);
  const ui = t(lang);

  useEffect(() => {
    if (!model) return;
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
  }, [model, onClose]);

  if (!model) return null;

  const src = `https://sketchfab.com/models/${model.sketchfab}/embed?autostart=1&ui_infos=0&ui_controls=1&ui_watermark=0`;
  const page = `https://sketchfab.com/3d-models/${model.sketchfab}`;
  const name = lang === "hi" ? model.nameHi : model.name;

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-[color-mix(in_oklab,var(--color-ink)_55%,transparent)] p-3 sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex h-[min(86dvh,760px)] w-full max-w-5xl scale-100 flex-col overflow-hidden rounded-2xl bg-ink text-bg shadow-[0_24px_80px_rgba(20,28,18,0.45)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="model-title"
      >
        <header className="flex items-start justify-between gap-3 px-4 py-3 sm:px-5">
          <div>
            <h3 id="model-title" className="font-display text-lg text-bg">
              {name}
            </h3>
            <p className="text-xs text-[color-mix(in_oklab,var(--color-bg)_70%,transparent)]">
              {model.creator} · {ui.drag}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={page}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-medium text-bg/80 hover:bg-white/10"
            >
              <ExternalLink className="size-3.5" />
              {ui.fullPage}
            </a>
            <Button variant="ghost" size="sm" className="text-bg hover:bg-white/10" onClick={onClose}>
              <X className="size-4" />
              {ui.close}
            </Button>
          </div>
        </header>
        <iframe
          title={name}
          src={src}
          className="min-h-0 flex-1 border-0 bg-black"
          allow="autoplay; fullscreen; xr-spatial-tracking; accelerometer; gyroscope"
          allowFullScreen
        />
      </div>
    </div>
  );
}
