"use client";

import { ArrowRight, Loader2, Plus } from "lucide-react";
import type { GenerateResponse, Recipe } from "@/lib/types";
import { PantryDiagram } from "./PantryDiagram";
import {
  Hero,
  InfoCard,
  RecipeMeta,
  TagList,
  primaryBtn,
  secondaryBtn,
} from "./ui";

interface Props {
  data: GenerateResponse;
  total: number;
  query: string;
  busy: boolean;
  onSelect: (r: Recipe) => void;
  onAddSuggestion: (name: string) => void;
}

export function ResultsScreen({
  data,
  total,
  query,
  busy,
  onSelect,
  onAddSuggestion,
}: Props) {
  if (data.status === "insufficient" || data.recipes.length === 0) {
    return (
      <div className="mx-auto max-w-3xl">
        <InfoCard
          n="00"
          eyebrow="Honest answer"
          title="Not enough for a full meal yet"
          tone="sand"
        >
          <div className="border-t border-line pt-6">
            <p className="max-w-xl text-base leading-relaxed text-navy/80 sm:text-lg">
              {data.message ||
                "These ingredients do not make a complete meal on their own."}
            </p>

            {data.suggestions.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold">
                  Adding one of these would help
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => onAddSuggestion(s)}
                      disabled={busy}
                      className={secondaryBtn}
                    >
                      {busy ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </InfoCard>
      </div>
    );
  }

  const [top, ...others] = data.recipes;

  return (
    <div className="space-y-12 sm:space-y-16">
      <Hero
        eyebrow="Chef's recommendation"
        title={top.name}
        size="lg"
        meta={
          <>
            <RecipeMeta recipe={top} total={total} />
            <TagList tags={top.tags} />
          </>
        }
        quoteLabel="Why this one"
        quote={top.why || undefined}
        actions={
          <button
            onClick={() => onSelect(top)}
            className={`${primaryBtn} w-full sm:w-auto`}
          >
            Cook this
            <ArrowRight className="h-4 w-4" />
          </button>
        }
        aside={
          <PantryDiagram
            label="The meal is assembled here"
            items={top.uses}
            query={query}
            resultTitle={`${top.time_minutes} min`}
            resultNote={`Uses ${top.uses.length} of ${total}`}
          />
        }
      />

      {others.length > 0 && (
        <section>
          <p className="label mb-4 text-muted">Other options</p>
          <div className="grid gap-6 md:grid-cols-2">
            {others.map((r, idx) => (
              <button
                key={r.id}
                onClick={() => onSelect(r)}
                className={`group flex min-w-0 flex-col rounded-[2rem] border border-line p-6 text-left transition hover:-translate-y-0.5 hover:border-navy/40 sm:p-8 ${
                  idx % 2 === 0 ? "bg-peach" : "bg-sand"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="label flex items-center gap-2">
                    <span className="text-rust">
                      {String(idx + 2).padStart(2, "0")}
                    </span>
                    <span className="text-muted">Option</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-navy" />
                </div>
                <h3 className="mt-2 break-words font-display text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
                  {r.name}
                </h3>
                <div className="mt-4 space-y-3">
                  <RecipeMeta recipe={r} total={total} />
                  <TagList tags={r.tags} />
                </div>
                {r.why && (
                  <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-muted">
                    {r.why}
                  </p>
                )}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}