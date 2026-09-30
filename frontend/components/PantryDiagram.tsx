"use client";

import {
  Apple,
  Beef,
  Carrot,
  Drumstick,
  Egg,
  Fish,
  MessageSquareText,
  Milk,
  Salad,
  Search,
  Wheat,
  type LucideIcon,
} from "lucide-react";

const ICONS: [RegExp, LucideIcon][] = [
  [/chicken|turkey|duck/, Drumstick],
  [/beef|mutton|lamb|pork|meat|bacon|sausage/, Beef],
  [/egg/, Egg],
  [/fish|prawn|shrimp|tuna|salmon/, Fish],
  [/rice|wheat|bread|pasta|noodle|flour|oat|roti|chapati|dosa/, Wheat],
  [/milk|cheese|paneer|curd|yogurt|yoghurt|butter|cream/, Milk],
  [
    /tomato|onion|carrot|potato|spinach|pepper|capsicum|cabbage|broccoli|beans|peas/,
    Carrot,
  ],
  [/apple|banana|mango|lemon|orange|berry/, Apple],
];

function iconFor(name: string): LucideIcon {
  const n = name.toLowerCase();
  return ICONS.find(([re]) => re.test(n))?.[1] ?? Salad;
}

function IngredientCard({
  name,
  note,
  accent,
  ghost = false,
  className = "",
}: {
  name: string;
  note: string;
  accent: boolean;
  ghost?: boolean;
  className?: string;
}) {
  const Icon = ghost ? Salad : iconFor(name);
  return (
    <div
      className={`absolute rounded-2xl border p-3.5 shadow-lg shadow-black/25 ${
        ghost
          ? "border-dashed border-cream/30 bg-navy/60"
          : "border-cream/15 bg-navy-card"
      } ${className}`}
    >
      <Icon
        className={`h-5 w-5 ${accent ? "text-coral" : "text-cream"}`}
        strokeWidth={1.75}
      />
      <p
        className={`mt-3 truncate text-base sm:text-lg ${
          ghost ? "text-cream/50" : "text-cream"
        }`}
      >
        {name}
      </p>
      <p className="label-sm mt-1 truncate text-cream/50">{note}</p>
    </div>
  );
}

interface Props {
  label: string;
  items: string[];
  query: string;
  resultTitle: string;
  resultNote: string;
}

export function PantryDiagram({
  label,
  items,
  query,
  resultTitle,
  resultNote,
}: Props) {
  const hasBoth = items.length >= 2;
  const back = hasBoth ? items[0] : undefined;
  const front = hasBoth ? items[1] : items[0];
  const extra = Math.max(0, items.length - 2);

  return (
    <div className="pb-3" aria-hidden="true">
      <div className="panel-shadow dot-texture relative h-[340px] overflow-hidden rounded-[2rem] bg-navy text-cream sm:h-[390px]">
        {/* inner frame + decorative arcs */}
        <div className="pointer-events-none absolute inset-3 rounded-[1.5rem] border border-cream/10" />
        <div className="pointer-events-none absolute -bottom-28 right-[12%] h-72 w-72 rounded-full border border-cream/10" />

        <p className="label-sm absolute left-7 top-6 text-gold">{label}</p>

        {/* dashed connectors */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <g
            stroke="#e6b86a"
            strokeWidth="1"
            strokeDasharray="4 4"
            strokeLinecap="round"
            opacity="0.8"
          >
            <line x1="38" y1="48" x2="72" y2="26" vectorEffect="non-scaling-stroke" />
            <line x1="38" y1="54" x2="72" y2="76" vectorEffect="non-scaling-stroke" />
          </g>
        </svg>

        {/* tilted ingredient cards */}
        <div className="absolute left-[6%] top-[32%] z-10 h-40 w-[52%] sm:left-[10%] sm:top-[26%]">
          {back && (
            <IngredientCard
              name={back}
              note="In your pantry"
              accent={false}
              className="left-0 top-0 w-[104px] -rotate-6 sm:w-[136px]"
            />
          )}
          <IngredientCard
            name={front ?? "Add ingredients"}
            note={
              !front
                ? "Nothing yet"
                : extra > 0
                  ? `+${extra} more in pantry`
                  : "In your pantry"
            }
            accent
            ghost={!front}
            className="left-[26px] top-[44px] w-[108px] rotate-3 sm:left-[44px] sm:top-[54px] sm:w-[144px]"
          />
        </div>

        {/* coral query chip */}
        <div className="absolute right-[7%] top-[20%] z-10 flex max-w-[52%] items-center gap-2 rounded-xl bg-coral px-3 py-2.5 text-navy sm:max-w-[60%]">
          <Search className="h-4 w-4 shrink-0" strokeWidth={2} />
          <span className="truncate font-mono text-[10px] sm:text-[11px]">
            &ldquo;{query}&rdquo;
          </span>
        </div>

        {/* teal answer card */}
        <div className="absolute bottom-[9%] right-[7%] z-10 w-[44%] max-w-[190px] rounded-xl border border-cream/20 bg-teal p-3 text-teal-ink sm:bottom-[14%] sm:w-[46%]">
          <div className="flex items-center gap-2">
            <MessageSquareText className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            <span className="truncate font-display text-lg font-bold leading-tight">
              {resultTitle}
            </span>
          </div>
          <p className="label-sm mt-2 truncate opacity-80">{resultNote}</p>
        </div>
      </div>
    </div>
  );
}