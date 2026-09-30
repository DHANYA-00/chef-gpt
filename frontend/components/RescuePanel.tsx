"use client";

import { useState } from "react";
import { CircleAlert, Loader2, X } from "lucide-react";
import type { RescueResponse } from "@/lib/types";
import {
  NumBadge,
  cardClass,
  inputClass,
  primaryBtn,
  secondaryBtn,
} from "./ui";

const PRESETS = [
  "Too salty",
  "Too spicy",
  "Too watery",
  "Undercooked",
  "Burned",
  "Other",
];

interface Props {
  stepIndex: number;
  onRescue: (problem: string, stepIndex: number) => Promise<RescueResponse>;
  onClose: () => void;
}

export function RescuePanel({ stepIndex, onRescue, onClose }: Props) {
  const [other, setOther] = useState(false);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RescueResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(problem: string) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      setResult(await onRescue(problem, stepIndex));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cardClass}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="label text-rust">Rescue my meal</p>
          <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight">
            What went wrong?
          </h3>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="-m-2 p-2 text-muted transition hover:text-navy"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            disabled={loading}
            onClick={() => (p === "Other" ? setOther(true) : run(p))}
            className={secondaryBtn}
          >
            {p}
          </button>
        ))}
      </div>

      {other && (
        <div className="mt-3 flex gap-2">
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && custom.trim() && run(custom.trim())}
            placeholder="Describe the problem"
            maxLength={300}
            className={inputClass}
            autoFocus
          />
          <button
            onClick={() => run(custom.trim())}
            disabled={loading || !custom.trim()}
            className={`${primaryBtn} shrink-0`}
          >
            Help
          </button>
        </div>
      )}

      {loading && (
        <p className="mt-5 flex items-center gap-2 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          Working out a fix
        </p>
      )}

      {error && (
        <p role="alert" className="mt-5 text-sm font-medium text-rust">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-6 space-y-4 border-t border-line pt-5">
          <p className="font-medium">{result.summary}</p>
          <ol className="space-y-3">
            {result.fix_steps.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed sm:text-base">
                <NumBadge n={i + 1} />
                <span className="pt-0.5">{s}</span>
              </li>
            ))}
          </ol>
          {result.safety_note && (
            <div className="flex items-start gap-2 rounded-2xl border border-gold bg-gold/25 px-4 py-3 text-sm text-[#4d3508]">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{result.safety_note}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}