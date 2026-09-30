"use client";

import { ChefHat, ChevronLeft, UtensilsCrossed } from "lucide-react";

interface Props {
  step: number;
  total: number;
  label: string;
  backLabel?: string;
  onBack?: () => void;
}

const pad = (n: number) => String(n).padStart(2, "0");

const circle =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-cream-50 text-navy transition";

export function SiteHeader({ step, total, label, backLabel, onBack }: Props) {
  return (
    <header className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="flex items-center justify-between gap-3 border-b border-line py-5">
        {onBack ? (
          <button
            onClick={onBack}
            aria-label={backLabel ?? "Back"}
            className="group flex items-center gap-3"
          >
            <span className={`${circle} group-hover:border-navy/40`}>
              <ChevronLeft className="h-5 w-5" />
            </span>
            <span className="label hidden text-muted transition group-hover:text-navy sm:inline">
              {backLabel}
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className={circle}>
              <ChefHat className="h-5 w-5" />
            </span>
            <span className="label hidden text-muted sm:inline">Chef-GPT</span>
          </div>
        )}

        <div className="flex items-center gap-2.5" aria-label={`Step ${step} of ${total}: ${label}`}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line font-mono text-[11px]">
            {pad(step)}
          </span>
          <span className="label hidden text-muted md:inline">
            {label} / {pad(total)}
          </span>
        </div>

        <span
          aria-hidden
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral/15 text-rust"
        >
          <UtensilsCrossed className="h-5 w-5" />
        </span>
      </div>
    </header>
  );
}