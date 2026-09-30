"use client";

import { useEffect, useState } from "react";
import { CircleAlert } from "lucide-react";
import { api } from "@/lib/api";
import { describeQuery } from "@/lib/labels";
import { RecipeSheet } from "@/components/RecipeSheet";
import type {
  GenerateResponse,
  NoticeState,
  Preferences,
  Recipe,
} from "@/lib/types";
import { SiteHeader } from "@/components/SiteHeader";
import { SetupScreen } from "@/components/SetupScreen";
import { ResultsScreen } from "@/components/ResultsScreen";
import { RecipeScreen } from "@/components/RecipeScreen";
import { CookScreen } from "@/components/CookScreen";

type Screen = "setup" | "results" | "adapt" | "cook";

const STEPS: Record<Screen, { n: number; label: string }> = {
  setup: { n: 1, label: "Pantry" },
  results: { n: 2, label: "Options" },
  adapt: { n: 3, label: "Adapt" },
  cook: { n: 4, label: "Cook" },
};

const BACK: Partial<Record<Screen, { label: string; to: Screen }>> = {
  results: { label: "Back to pantry", to: "setup" },
  adapt: { label: "All options", to: "results" },
  cook: { label: "Back to recipe", to: "adapt" },
};

const DEFAULT_PREFS: Preferences = {
  ingredients: [],
  goal: "any",
  timeLimit: 30,
  hunger: "normal",
  usage: "as_many",
  diet: "None",
  calories: "",
};

const errMsg = (e: unknown) =>
  e instanceof Error ? e.message : "Something went wrong.";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("setup");
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS);
  const [results, setResults] = useState<GenerateResponse | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [history, setHistory] = useState<Recipe[]>([]);
  const [available, setAvailable] = useState<string[]>([]);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [screen]);

  async function runGenerate(next: Preferences) {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const data = await api.generate(next);
      setPrefs(next);
      setResults(data);
      setScreen("results");
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(false);
    }
  }

  function selectRecipe(r: Recipe) {
    setRecipe(r);
    setHistory([]);
    setAvailable(prefs.ingredients);
    setNotice(null);
    setError(null);
    setScreen("adapt");
  }

  function findAnother(remaining: string[]) {
    if (remaining.length === 0) {
      setError("You have no ingredients left. Add some and try again.");
      setScreen("setup");
      return;
    }
    runGenerate({ ...prefs, ingredients: remaining });
  }

  async function handleModify(instruction: string) {
    if (!recipe) return false;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const res = await api.modify(recipe, instruction, available);
      if (res.changed) {
        setHistory((h) => [...h, recipe]);
        setRecipe(res.recipe);
      }
      setNotice({ kind: res.changed ? "success" : "info", text: res.summary });
      return true;
    } catch (e) {
      setError(errMsg(e));
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function handleMissing(name: string) {
    if (!recipe) return false;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const res = await api.substitute(recipe, name, available);
      if (res.works) {
        setHistory((h) => [...h, recipe]);
        setRecipe(res.recipe);
        setAvailable(res.available);
        setNotice({ kind: "success", text: res.message });
      } else {
        setNotice({
          kind: "warn",
          text: res.message,
          action: {
            label: "Find another recipe",
            run: () => findAnother(res.available),
          },
        });
      }
      return true;
    } catch (e) {
      setError(errMsg(e));
      return false;
    } finally {
      setBusy(false);
    }
  }

  function handleUndo() {
    setHistory((h) => {
      if (h.length === 0) return h;
      setRecipe(h[h.length - 1]);
      return h.slice(0, -1);
    });
    setNotice(null);
  }

  const step = STEPS[screen];
  const back = BACK[screen];
  const query = describeQuery(prefs);

  return (
    <>
    <main className="min-h-dvh print:hidden">
      <SiteHeader
        step={step.n}
        total={4}
        label={step.label}
        backLabel={back?.label}
        onBack={back ? () => setScreen(back.to) : undefined}
      />

      <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 sm:px-6 sm:py-16">
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-2xl border border-rust/30 bg-rust/10 px-4 py-3 text-sm text-rust"
          >
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {screen === "setup" && (
          <SetupScreen
            prefs={prefs}
            onChange={setPrefs}
            onSubmit={runGenerate}
            loading={busy}
          />
        )}

        {screen === "results" && results && (
          <ResultsScreen
            data={results}
            total={prefs.ingredients.length}
            query={query}
            busy={busy}
            onSelect={selectRecipe}
            onAddSuggestion={(name) =>
              runGenerate({ ...prefs, ingredients: [...prefs.ingredients, name] })
            }
          />
        )}

        {screen === "adapt" && recipe && (
          <RecipeScreen
            recipe={recipe}
            query={query}
            canUndo={history.length > 0}
            busy={busy}
            notice={notice}
            onDismissNotice={() => setNotice(null)}
            onModify={handleModify}
            onMissing={handleMissing}
            onUndo={handleUndo}
            onCook={() => setScreen("cook")}
          />
        )}

        {screen === "cook" && recipe && (
          <div className="mx-auto max-w-2xl">
            <CookScreen
              recipe={recipe}
              onRescue={(problem, idx) => api.rescue(recipe, problem, idx, available)}
              onExit={() => setScreen("adapt")}
            />
          </div>
        )}
      </div>
    </main>

    {recipe && <RecipeSheet recipe={recipe} />}
    </>
  );
}