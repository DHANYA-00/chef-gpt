"use client";

import type { ReactNode } from "react";
import { Check, CircleAlert, Clock, Info, Users, X } from "lucide-react";
import type { NoticeState, Recipe } from "@/lib/types";

/* ---------- Shared class strings ---------- */

export const inputClass =
  "w-full rounded-xl border border-line bg-cream-50 px-4 py-3 text-base text-navy outline-none transition placeholder:text-muted/70 focus:border-navy focus:ring-2 focus:ring-navy/15 disabled:opacity-60 sm:text-sm";

export const primaryBtn =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-navy-soft active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

export const accentBtn =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-medium text-navy transition hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

export const secondaryBtn =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line bg-cream-50 px-4 py-2 text-sm font-medium text-navy transition hover:border-navy/40 hover:bg-white/60 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

export const cardClass =
  "rounded-[2rem] border border-line bg-peach p-6 sm:p-8";

/* ---------- Hero (eyebrow, big serif title, quote, diagram) ---------- */

export function Hero({
  eyebrow,
  title,
  size = "xl",
  subtitle,
  meta,
  quoteLabel = "In plain English",
  quote,
  actions,
  aside,
}: {
  eyebrow: string;
  title: string;
  size?: "xl" | "lg";
  subtitle?: string;
  meta?: ReactNode;
  quoteLabel?: string;
  quote?: string;
  actions?: ReactNode;
  aside: ReactNode;
}) {
  const titleClass =
    size === "xl"
      ? "text-7xl font-black leading-[0.9] tracking-[-0.045em] sm:text-8xl lg:text-9xl"
      : "text-4xl font-extrabold leading-[1.03] tracking-[-0.03em] sm:text-5xl lg:text-6xl";

  return (
    <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
      <div className="min-w-0 space-y-6">
        <p className="label text-rust">{eyebrow}</p>
        <h2 className={`break-words font-display text-navy ${titleClass}`}>
          {title}
        </h2>
        {subtitle && (
          <p className="max-w-md text-xl font-light leading-relaxed text-muted sm:text-2xl">
            {subtitle}
          </p>
        )}
        {meta && <div className="space-y-3">{meta}</div>}
        {quote && (
          <div className="max-w-lg border-l-4 border-coral pl-5">
            <p className="label text-muted">{quoteLabel}</p>
            <p className="mt-2 text-base leading-relaxed text-navy/80 sm:text-lg">
              {quote}
            </p>
          </div>
        )}
        {actions && <div>{actions}</div>}
      </div>
      <div className="min-w-0">{aside}</div>
    </section>
  );
}

/* ---------- Paired info cards ---------- */

export function InfoCard({
  n,
  eyebrow,
  title,
  tone = "peach",
  children,
}: {
  n: string;
  eyebrow: string;
  title: string;
  tone?: "peach" | "sand";
  children: ReactNode;
}) {
  return (
    <section
      className={`min-w-0 rounded-[2rem] border border-line p-6 sm:p-9 ${
        tone === "peach" ? "bg-peach" : "bg-sand"
      }`}
    >
      <p className="label flex items-center gap-2">
        <span className="text-rust">{n}</span>
        <span className="text-muted">{eyebrow}</span>
      </p>
      <h3 className="mt-2 font-display text-3xl font-bold tracking-tight text-navy sm:text-[2.5rem] sm:leading-tight">
        {title}
      </h3>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function NumBadge({ n }: { n: number }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-coral font-mono text-[11px] font-medium text-navy">
      {String(n).padStart(2, "0")}
    </span>
  );
}

/** Rows with dividers and coral numbered circles ("How it works" card). */
export function NumberedList({ items }: { items: ReactNode[] }) {
  return (
    <ol className="border-t border-line">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-4 border-b border-line py-4 last:border-b-0 last:pb-0"
        >
          <NumBadge n={i + 1} />
          <div className="pt-0.5 text-base leading-relaxed text-navy/85">
            {item}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Ring bullet, bold serif title, small description ("Real-world use" card). */
export function RingItem({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <li className="flex items-start gap-4">
      <span
        aria-hidden
        className="mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-coral"
      >
        <span className="h-1 w-1 rounded-full bg-coral" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="break-words font-display text-lg font-bold leading-snug text-navy">
          {title}
        </p>
        {description && (
          <p className="mt-0.5 text-sm text-muted">{description}</p>
        )}
        {action && <div className="mt-1.5">{action}</div>}
      </div>
    </li>
  );
}

/* ---------- Form pieces ---------- */

export function Group({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-navy">{title}</h4>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function Segmented<T extends string | number | null>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition ${
              active
                ? "border-navy bg-navy text-cream"
                : "border-line bg-cream-50 text-navy hover:border-navy/40"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function TagList({
  tags,
  tone = "light",
}: {
  tags: string[];
  tone?: "light" | "dark";
}) {
  if (!tags.length) return null;
  const style = tone === "dark" ? "bg-cream/10 text-cream" : "bg-sand text-navy";
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <span key={t} className={`label rounded-full px-2.5 py-1 ${style}`}>
          {t}
        </span>
      ))}
    </div>
  );
}

export function RecipeMeta({
  recipe,
  total,
  tone = "light",
}: {
  recipe: Recipe;
  total?: number;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-sm ${
        tone === "dark" ? "text-cream/75" : "text-muted"
      }`}
    >
      <span className="inline-flex items-center gap-1.5">
        <Clock className="h-4 w-4" />
        {recipe.time_minutes} min
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Users className="h-4 w-4" />
        {recipe.servings} {recipe.servings === 1 ? "serving" : "servings"}
      </span>
      {total !== undefined && (
        <span className="inline-flex items-center gap-1.5">
          <Check className="h-4 w-4" />
          Uses {recipe.uses.length} of {total} ingredients
        </span>
      )}
    </div>
  );
}

export function Notice({
  notice,
  onDismiss,
}: {
  notice: NoticeState;
  onDismiss: () => void;
}) {
  const styles = {
    success: "border-teal/50 bg-teal/15 text-teal-ink",
    info: "border-line bg-sand text-navy",
    warn: "border-gold bg-gold/25 text-[#4d3508]",
  }[notice.kind];
  const Icon = notice.kind === "warn" ? CircleAlert : Info;

  return (
    <div
      role="status"
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${styles}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="leading-relaxed">{notice.text}</p>
        {notice.action && (
          <button
            onClick={notice.action.run}
            className="mt-2 min-h-8 text-sm font-medium underline underline-offset-2"
          >
            {notice.action.label}
          </button>
        )}
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="-m-1 p-1 opacity-60 transition hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}