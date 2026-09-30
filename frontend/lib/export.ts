import type { Recipe } from "./types";

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "recipe"
  );
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m && s) return `${m} min ${s} sec`;
  if (m) return `${m} min`;
  return `${s} sec`;
}

export function recipeToText(recipe: Recipe): string {
  const title = recipe.name.toUpperCase();
  const lines: string[] = [];

  lines.push(title, "=".repeat(Math.min(Math.max(title.length, 12), 60)), "");

  lines.push(
    `Time: ${recipe.time_minutes} min | Serves: ${recipe.servings}` +
      (recipe.tags.length ? ` | ${recipe.tags.join(", ")}` : "")
  );

  if (recipe.why) lines.push("", recipe.why);

  lines.push("", "INGREDIENTS", "-----------");
  for (const ing of recipe.ingredients) {
    lines.push(`- ${ing.name}${ing.quantity ? ` (${ing.quantity})` : ""}`);
  }

  lines.push("", "STEPS", "-----");
  recipe.steps.forEach((s, i) => {
    lines.push(
      `${i + 1}. ${s.text}${
        s.timer_seconds ? ` [timer: ${formatTimer(s.timer_seconds)}]` : ""
      }`
    );
  });

  if (recipe.notes.length) {
    lines.push("", "NOTES", "-----");
    for (const n of recipe.notes) lines.push(`- ${n}`);
  }

  const saved = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  lines.push("", `Saved from Chef-GPT on ${saved}`, "");

  return lines.join("\n");
}

export function downloadRecipe(recipe: Recipe) {
  const blob = new Blob([recipeToText(recipe)], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);

  a.href = url;
  a.download = `${slugify(recipe.name)}-${date}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  // Revoking immediately can cancel the download in Safari
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Opens the print dialog. Choose "Save as PDF" as the destination. */
export function printRecipe(recipe: Recipe) {
  const previous = document.title;
  // Browsers use the page title as the default PDF file name
  document.title = `${slugify(recipe.name)}-${new Date().toISOString().slice(0, 10)}`;

  const restore = () => {
    document.title = previous;
    window.removeEventListener("afterprint", restore);
  };
  window.addEventListener("afterprint", restore);

  window.print();
}