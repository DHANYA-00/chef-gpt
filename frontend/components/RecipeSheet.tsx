import type { Recipe } from "@/lib/types";

export function RecipeSheet({ recipe }: { recipe: Recipe }) {
  return (
    <article className="hidden bg-white p-2 text-black print:block">
      <h1 className="font-display text-4xl font-bold leading-tight">
        {recipe.name}
      </h1>

      <p className="mt-2 font-mono text-xs uppercase tracking-widest text-neutral-600">
        {recipe.time_minutes} min · Serves {recipe.servings}
        {recipe.tags.length > 0 && ` · ${recipe.tags.join(", ")}`}
      </p>

      {recipe.why && (
        <p className="mt-4 border-l-4 border-neutral-400 pl-3 text-sm leading-relaxed">
          {recipe.why}
        </p>
      )}

      <h2 className="mt-8 border-b border-neutral-300 pb-1 font-display text-2xl font-bold">
        Ingredients
      </h2>
      <ul className="mt-3 space-y-1 text-sm">
        {recipe.ingredients.map((ing) => (
          <li key={ing.name} className="break-inside-avoid">
            <span className="font-medium">{ing.name}</span>
            {ing.quantity && <span> ({ing.quantity})</span>}
          </li>
        ))}
      </ul>

      <h2 className="mt-8 border-b border-neutral-300 pb-1 font-display text-2xl font-bold">
        Steps
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
        {recipe.steps.map((s, i) => (
          <li key={i} className="break-inside-avoid">
            {s.text}
            {s.timer_seconds ? (
              <span className="text-neutral-600">
                {" "}
                (timer: {Math.round(s.timer_seconds / 60) || 1} min)
              </span>
            ) : null}
          </li>
        ))}
      </ol>

      {recipe.notes.length > 0 && (
        <>
          <h2 className="mt-8 border-b border-neutral-300 pb-1 font-display text-2xl font-bold">
            Notes
          </h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            {recipe.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </>
      )}

      <p className="mt-10 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
        Saved from Chef-GPT
      </p>
    </article>
  );
}