export type Goal =
  | "any"
  | "quick"
  | "high_protein"
  | "low_calorie"
  | "filling"
  | "healthy"
  | "comfort";
export type Hunger = "light" | "normal" | "very_hungry";
export type Usage = "everything" | "as_many" | "necessary";

export interface Step {
  text: string;
  timer_seconds: number | null;
}

export interface RecipeIngredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  id: string;
  name: string;
  time_minutes: number;
  servings: number;
  tags: string[];
  uses: string[];
  ingredients: RecipeIngredient[];
  steps: Step[];
  why: string;
  notes: string[];
}

export interface Preferences {
  ingredients: string[];
  goal: Goal;
  timeLimit: number | null; // null = 45+ minutes
  hunger: Hunger;
  usage: Usage;
  diet: string;
  calories: string;
}

export interface GenerateResponse {
  status: "ok" | "insufficient";
  message: string;
  suggestions: string[];
  recipes: Recipe[];
}

export interface ModifyResponse {
  recipe: Recipe;
  summary: string;
  changed: boolean;
}

export interface SubstituteResponse {
  works: boolean;
  message: string;
  recipe: Recipe;
  available: string[];
}

export interface RescueResponse {
  summary: string;
  fix_steps: string[];
  safety_note: string | null;
}

export interface NoticeState {
  kind: "success" | "info" | "warn";
  text: string;
  action?: { label: string; run: () => void };
}