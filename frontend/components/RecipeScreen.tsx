"use client";

import { useState } from "react";
import {
  Download,
  Dumbbell,
  Feather,
  Flame,
  Leaf,
  Loader2,
  PiggyBank,
  Play,
  Printer,
  Send,
  Undo2,
  Utensils,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { downloadRecipe, printRecipe } from "@/lib/export";
import type { NoticeState, Recipe } from "@/lib/types";
import { PantryDiagram } from "./PantryDiagram";
import {
  Hero,
  InfoCard,
  NumberedList,
  Notice,
  RecipeMeta,
  RingItem,
  TagList,
  inputClass,
  primaryBtn,
  secondaryBtn,
} from "./ui";

const QUICK: { label: string; instruction: string; icon: LucideIcon }[] = [
  { label: "Spicier", instruction: "Make this recipe spicier.", icon: Flame },
  { label: "Faster", instruction: "Make this recipe faster to cook.", icon: Zap },
  {
    label: "More protein",
    instruction: "Make this recipe higher in protein.",
    icon: Dumbbell,
  },
  { label: "Healthier", instruction: "Make this recipe healthier.", icon: Leaf },
  { label: "Cheaper", instruction: "Make this recipe cheaper to make.", icon: PiggyBank },
  {
    label: "More filling",
    instruction: "Make this recipe more filling.",
    icon: Utensils,
  },
  { label: "Easier", instruction: "Make this recipe easier to cook.", icon: Feather },
];

interface Props {
  recipe: Recipe;
  query: string;
  canUndo: boolean;
  busy: boolean;
  notice: NoticeState | null;
  onDismissNotice: () => void;
  onModify: (instruction: string) => Promise<boolean>;
  onMissing: (name: string) => Promise<boolean>;
  onUndo: () => void;
  onCook: () => void;
}

export function RecipeScreen({
  recipe,
  query,
  canUndo,
  busy,
  notice,
  onDismissNotice,
  onModify,
  onMissing,
  onUndo,
  onCook,
}: Props) {
  const [ask, setAsk] = useState("");
  const [active, setActive] = useState<string | null>(null);

  async function run(key: string, fn: () => Promise<boolean>) {
    setActive(key);
    const ok = await fn();
    setActive(null);
    return ok;
  }

  async function handleAsk() {
    const text = ask.trim();
    if (!text || busy) return;
    const ok = await run("ask", () => onModify(text));
    if (ok) setAsk("");
  }

  const spinner = <Loader2 className="h-4 w-4 animate-spin" />;

  return (
    <div className="space-y-12 sm:space-y-16">
      <Hero
        eyebrow="Your recipe"
        title={recipe.name}
        size="lg"
        meta={
          <>
            <RecipeMeta recipe={recipe} />
            <TagList tags={recipe.tags} />
          </>
        }
        quoteLabel="Why this recipe"
        quote={recipe.why || undefined}
        actions={
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              onClick={onCook}
              disabled={busy}
              className={`${primaryBtn} w-full sm:w-auto`}
            >
              <Play className="h-4 w-4" />
              Start cooking
            </button>
            <button
              onClick={() => downloadRecipe(recipe)}
              disabled={busy}
              className={`${secondaryBtn} w-full sm:w-auto`}
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            <button
              onClick={() => printRecipe(recipe)}
              disabled={busy}
              className={`${secondaryBtn} w-full sm:w-auto`}
            >
              <Printer className="h-4 w-4" />
              Save as PDF
            </button>
          </div>
        }
        aside={
          <PantryDiagram
            label="The meal is assembled here"
            items={
              recipe.uses.length
                ? recipe.uses
                : recipe.ingredients.map((i) => i.name)
            }
            query={query}
            resultTitle={`${recipe.time_minutes} min`}
            resultNote={`${recipe.servings} ${
              recipe.servings === 1 ? "serving" : "servings"
            }`}
          />
        }
      />

      {notice && (
        <div className="-mt-4 sm:-mt-8">
          <Notice notice={notice} onDismiss={onDismissNotice} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <InfoCard n="01" eyebrow="The method" title="Steps" tone="peach">
          <NumberedList items={recipe.steps.map((s) => s.text)} />

          {recipe.notes.length > 0 && (
            <div className="mt-6 border-t border-line pt-5">
              <p className="label text-muted">Notes</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                {recipe.notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>
          )}
        </InfoCard>

        <InfoCard n="02" eyebrow="Your pantry" title="Ingredients" tone="sand">
          <ul className="space-y-5 border-t border-line pt-6">
            {recipe.ingredients.map((ing) => (
              <RingItem
                key={ing.name}
                title={ing.name}
                description={ing.quantity || undefined}
                action={
                  <button
                    disabled={busy}
                    onClick={() => run(ing.name, () => onMissing(ing.name))}
                    className="inline-flex min-h-8 items-center gap-1.5 text-xs font-medium text-rust underline-offset-2 hover:underline disabled:opacity-50"
                  >
                    {active === ing.name && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    )}
                    I don&apos;t have this
                  </button>
                }
              />
            ))}
          </ul>
        </InfoCard>
      </div>

      <InfoCard n="03" eyebrow="Adapt" title="Make it..." tone="peach">
        <div className="grid gap-8 border-t border-line pt-6 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
          <div>
            <p className="label text-muted">Quick changes</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {QUICK.map(({ label, instruction, icon: Icon }) => (
                <button
                  key={label}
                  disabled={busy}
                  onClick={() => run(label, () => onModify(instruction))}
                  className={secondaryBtn}
                >
                  {active === label ? spinner : <Icon className="h-4 w-4" />}
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="ask" className="label text-muted">
              Ask Chef-GPT
            </label>
            <div className="mt-3 flex gap-2">
              <input
                id="ask"
                value={ask}
                onChange={(e) => setAsk(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                placeholder="Can I cook this in one pan?"
                maxLength={300}
                disabled={busy}
                className={inputClass}
                enterKeyHint="send"
              />
              <button
                onClick={handleAsk}
                disabled={busy || !ask.trim()}
                className={`${primaryBtn} shrink-0 px-4`}
                aria-label="Send"
              >
                {active === "ask" ? spinner : <Send className="h-4 w-4" />}
              </button>
            </div>

            {canUndo && (
              <button
                onClick={onUndo}
                disabled={busy}
                className={`${secondaryBtn} mt-4`}
              >
                <Undo2 className="h-4 w-4" />
                Undo last change
              </button>
            )}
          </div>
        </div>
      </InfoCard>
    </div>
  );
}