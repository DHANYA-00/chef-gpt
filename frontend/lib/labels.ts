import type { Goal, Preferences } from "./types";

export const GOALS: { value: Goal; label: string }[] = [
  { value: "any", label: "No preference" },
  { value: "quick", label: "Something quick" },
  { value: "high_protein", label: "High protein" },
  { value: "low_calorie", label: "Low calorie" },
  { value: "filling", label: "Filling" },
  { value: "healthy", label: "Healthy" },
  { value: "comfort", label: "Comfort food" },
];

/** Short text for the coral chip in the diagram, e.g. "high protein, 30 min". */
export function describeQuery(p: Preferences): string {
  const goal = GOALS.find((g) => g.value === p.goal);
  const parts: string[] = [];
  if (goal && p.goal !== "any") parts.push(goal.label.toLowerCase());
  parts.push(p.timeLimit ? `${p.timeLimit} min` : "45+ min");
  return parts.join(", ");
}