import type {
  GenerateResponse,
  ModifyResponse,
  Preferences,
  Recipe,
  RescueResponse,
  SubstituteResponse,
} from "./types";

async function post<T>(action: string, body: unknown): Promise<T> {
  const res = await fetch(`/api/recipes/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? `Request failed (${res.status})`);
  }
  return data as T;
}

export const api = {
  generate: (p: Preferences) =>
    post<GenerateResponse>("generate", {
      ingredients: p.ingredients,
      goal: p.goal,
      time_limit: p.timeLimit,
      hunger: p.hunger,
      usage: p.usage,
      diet: p.diet !== "None" ? p.diet : null,
      calories: p.calories.trim() ? parseInt(p.calories, 10) : null,
    }),

  modify: (recipe: Recipe, instruction: string, ingredients: string[]) =>
    post<ModifyResponse>("modify", { recipe, instruction, ingredients }),

  substitute: (recipe: Recipe, missing: string, ingredients: string[]) =>
    post<SubstituteResponse>("substitute", { recipe, missing, ingredients }),

  rescue: (
    recipe: Recipe,
    problem: string,
    stepIndex: number,
    ingredients: string[]
  ) =>
    post<RescueResponse>("rescue", {
      recipe,
      problem,
      step_index: stepIndex,
      ingredients,
    }),
};