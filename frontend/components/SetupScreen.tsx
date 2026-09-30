"use client";

import { useState } from "react";
import { Loader2, Plus, Sparkles, X } from "lucide-react";
import type { Hunger, Preferences, Usage } from "@/lib/types";
import { GOALS, describeQuery } from "@/lib/labels";
import { PantryDiagram } from "./PantryDiagram";
import {
  Group,
  Hero,
  InfoCard,
  Segmented,
  inputClass,
  primaryBtn,
  secondaryBtn,
} from "./ui";

const TIMES: { value: number | null; label: string }[] = [
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: null, label: "45+ min" },
];

const HUNGER: { value: Hunger; label: string }[] = [
  { value: "light", label: "Light meal" },
  { value: "normal", label: "Normal" },
  { value: "very_hungry", label: "Really hungry" },
];

const USAGE: { value: Usage; label: string; hint: string }[] = [
  {
    value: "everything",
    label: "Use everything",
    hint: "Every ingredient goes into the dish.",
  },
  {
    value: "as_many",
    label: "Use as many as possible",
    hint: "Skips anything that does not fit.",
  },
  {
    value: "necessary",
    label: "Only what is necessary",
    hint: "Tells you what to save for later.",
  },
];

const DIETS = [
  "None",
  "Vegan",
  "Vegetarian",
  "Keto",
  "Low-Carb",
  "High-Protein",
  "Gluten-Free",
  "Dairy-Free",
];

export function mergeIngredients(existing: string[], raw: string): string[] {
  const seen = new Set(existing.map((i) => i.toLowerCase()));
  const next = [...existing];
  for (const item of raw.split(",")) {
    const value = item.trim().slice(0, 60);
    if (value && !seen.has(value.toLowerCase()) && next.length < 30) {
      next.push(value);
      seen.add(value.toLowerCase());
    }
  }
  return next;
}

interface Props {
  prefs: Preferences;
  onChange: (p: Preferences) => void;
  onSubmit: (p: Preferences) => void;
  loading: boolean;
}

export function SetupScreen({ prefs, onChange, onSubmit, loading }: Props) {
  const [draft, setDraft] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  function set<K extends keyof Preferences>(key: K, value: Preferences[K]) {
    onChange({ ...prefs, [key]: value });
  }

  function addDraft() {
    if (!draft.trim()) return;
    set("ingredients", mergeIngredients(prefs.ingredients, draft));
    setDraft("");
  }

  function remove(item: string) {
    set(
      "ingredients",
      prefs.ingredients.filter((i) => i !== item)
    );
  }

  function handleFind() {
    setLocalError(null);
    const merged = {
      ...prefs,
      ingredients: mergeIngredients(prefs.ingredients, draft),
    };

    if (merged.ingredients.length === 0) {
      setLocalError("Add at least one ingredient.");
      return;
    }
    const cal = merged.calories.trim();
    if (cal && (!/^\d+$/.test(cal) || +cal < 100 || +cal > 5000)) {
      setLocalError("Calorie limit must be a whole number between 100 and 5000.");
      return;
    }

    setDraft("");
    onChange(merged);
    onSubmit(merged);
  }

  const count = prefs.ingredients.length;

  return (
    <div className="space-y-12 sm:space-y-16">
      <Hero
        eyebrow="A closer look at your kitchen"
        title="Pantry"
        subtitle="What are you cooking with tonight?"
        quote="Add what you have. Chef-GPT suggests meals using only those ingredients, then walks you through cooking one step at a time."
        aside={
          <PantryDiagram
            label="The meal is assembled here"
            items={prefs.ingredients}
            query={describeQuery(prefs)}
            resultTitle={
              count ? `${count} ingredient${count === 1 ? "" : "s"}` : "Nothing yet"
            }
            resultNote={count ? "Ready to cook with" : "Add ingredients below"}
          />
        }
      />

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <InfoCard n="01" eyebrow="What you have" title="Ingredients" tone="peach">
          <div className="space-y-7 border-t border-line pt-6">
            <Group
              title="Add your ingredients"
              hint="Press Enter, or separate with commas to add several at once."
            >
              <div className="flex gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addDraft();
                    }
                  }}
                  placeholder="chicken, rice, eggs, tomato"
                  className={inputClass}
                  aria-label="Add an ingredient"
                  enterKeyHint="done"
                />
                <button
                  type="button"
                  onClick={addDraft}
                  aria-label="Add ingredient"
                  className={`${secondaryBtn} shrink-0`}
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>

              {prefs.ingredients.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {prefs.ingredients.map((item) => (
                    <li
                      key={item}
                      className="inline-flex max-w-full items-center gap-1 rounded-full bg-sand py-1 pl-3.5 pr-1.5 text-sm text-navy"
                    >
                      <span className="truncate">{item}</span>
                      <button
                        type="button"
                        onClick={() => remove(item)}
                        aria-label={`Remove ${item}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-navy/10 hover:text-navy"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Group>

            <Group title="What should Chef-GPT do with them?">
              <div
                role="radiogroup"
                aria-label="Ingredient usage"
                className="grid gap-2"
              >
                {USAGE.map((u) => {
                  const active = prefs.usage === u.value;
                  return (
                    <button
                      key={u.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => set("usage", u.value)}
                      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                        active
                          ? "border-navy bg-cream-50"
                          : "border-line hover:border-navy/40"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                          active ? "border-navy" : "border-muted"
                        }`}
                      >
                        {active && (
                          <span className="h-2 w-2 rounded-full bg-coral" />
                        )}
                      </span>
                      <span>
                        <span className="block text-sm font-medium">
                          {u.label}
                        </span>
                        <span className="block text-xs text-muted">{u.hint}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </Group>
          </div>
        </InfoCard>

        <InfoCard n="02" eyebrow="What you want" title="Preferences" tone="sand">
          <div className="space-y-7 border-t border-line pt-6">
            <Group title="What do you want?">
              <Segmented
                label="Goal"
                options={GOALS}
                value={prefs.goal}
                onChange={(v) => set("goal", v)}
              />
            </Group>

            <Group title="How much time do you have?">
              <Segmented
                label="Time"
                options={TIMES}
                value={prefs.timeLimit}
                onChange={(v) => set("timeLimit", v)}
              />
            </Group>

            <Group title="How hungry are you?">
              <Segmented
                label="Hunger"
                options={HUNGER}
                value={prefs.hunger}
                onChange={(v) => set("hunger", v)}
              />
            </Group>

            <Group title="Restrictions" hint="Optional">
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={prefs.diet}
                  onChange={(e) => set("diet", e.target.value)}
                  className={inputClass}
                  aria-label="Dietary preference"
                >
                  {DIETS.map((d) => (
                    <option key={d} value={d}>
                      {d === "None" ? "No dietary preference" : d}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  inputMode="numeric"
                  value={prefs.calories}
                  onChange={(e) => set("calories", e.target.value)}
                  placeholder="Calorie limit (e.g. 450)"
                  className={inputClass}
                  aria-label="Calorie limit"
                />
              </div>
            </Group>
          </div>
        </InfoCard>
      </div>

      <div className="space-y-3">
        {localError && (
          <p role="alert" className="text-sm font-medium text-rust">
            {localError}
          </p>
        )}
        <button
          type="button"
          onClick={handleFind}
          disabled={loading}
          className={`${primaryBtn} w-full sm:w-auto sm:min-w-72`}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Finding your meal
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Find something for me
            </>
          )}
        </button>
        {loading && (
          <p className="text-xs text-muted">
            The first request can take up to a minute if the server is waking up.
          </p>
        )}
      </div>
    </div>
  );
}