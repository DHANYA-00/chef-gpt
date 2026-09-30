"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  LifeBuoy,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { downloadRecipe } from "@/lib/export";
import type { Recipe, RescueResponse } from "@/lib/types";
import { RescuePanel } from "./RescuePanel";
import { accentBtn, cardClass, primaryBtn, secondaryBtn } from "./ui";

function format(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function StepTimer({ seconds }: { seconds: number }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const endAt = useRef(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        setRunning(false);
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate([300, 150, 300]);
        }
      }
    }, 250);
    return () => clearInterval(id);
  }, [running]);

  function toggle() {
    if (running) {
      setRunning(false);
      return;
    }
    const start = remaining === 0 ? seconds : remaining;
    setRemaining(start);
    endAt.current = Date.now() + start * 1000;
    setRunning(true);
  }

  function reset() {
    setRunning(false);
    setRemaining(seconds);
  }

  const finished = remaining === 0;

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-navy p-6 text-cream">
      <div
        className={`font-mono text-6xl font-medium tabular-nums sm:text-7xl ${
          finished ? "text-[#8fdccb]" : ""
        }`}
        aria-live="off"
      >
        {format(remaining)}
      </div>
      {finished && (
        <p className="label text-[#8fdccb]" role="status">
          Time is up
        </p>
      )}
      <div className="flex gap-2">
        <button onClick={toggle} className={accentBtn}>
          {running ? (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              {finished ? "Restart" : remaining < seconds ? "Resume" : "Start timer"}
            </>
          )}
        </button>
        <button
          onClick={reset}
          aria-label="Reset timer"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-cream/25 text-cream transition hover:bg-cream/10"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

interface Props {
  recipe: Recipe;
  onRescue: (problem: string, stepIndex: number) => Promise<RescueResponse>;
  onExit: () => void;
}

export function CookScreen({ recipe, onRescue, onExit }: Props) {
  const [i, setI] = useState(0);
  const [rescue, setRescue] = useState(false);

  const total = recipe.steps.length;
  const done = i >= total;
  const step = recipe.steps[i];

  // Keep the screen awake while cooking (where supported).
  useEffect(() => {
    let lock: WakeLockSentinel | null = null;
    const acquire = async () => {
      try {
        lock = (await navigator.wakeLock?.request("screen")) ?? null;
      } catch {
        /* not supported or denied */
      }
    };
    acquire();
    const onVisible = () => {
      if (document.visibilityState === "visible") acquire();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      lock?.release().catch(() => {});
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button onClick={onExit} className={secondaryBtn}>
          <ArrowLeft className="h-4 w-4" />
          Recipe
        </button>
        <p className="label truncate text-muted">{recipe.name}</p>
      </div>

      <div>
        <div
          className="h-2 overflow-hidden rounded-full bg-sand"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={Math.min(i, total)}
        >
          <div
            className="h-full rounded-full bg-coral transition-all"
            style={{ width: `${(Math.min(i, total) / total) * 100}%` }}
          />
        </div>
      </div>

      {done ? (
        <div className={`${cardClass} space-y-4 py-10 text-center`}>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal text-teal-ink">
            <Check className="h-6 w-6" />
          </div>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Enjoy your meal
          </h2>
          <p className="text-muted">You have finished {recipe.name}.</p>
          <div className="flex flex-col justify-center gap-2 sm:flex-row">

            <button onClick={() => downloadRecipe(recipe)} className={accentBtn}>
              <Download className="h-4 w-4" />
              Save this recipe
            </button>
            <button onClick={() => setI(0)} className={secondaryBtn}>
              Cook again
            </button>
            <button onClick={onExit} className={primaryBtn}>
              Back to recipe
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={`${cardClass} space-y-6`}>
            <p className="label text-rust">
              Step {i + 1} / {total}
            </p>
            <p className="font-display text-2xl font-medium leading-snug text-navy sm:text-4xl">
              {step.text}
            </p>
            {step.timer_seconds ? (
              <StepTimer key={i} seconds={step.timer_seconds} />
            ) : null}
          </div>

          {/* Sticky on phones so it is always within thumb reach */}
          <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-between gap-3 border-t border-line bg-cream/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
            <button
              onClick={() => setI((n) => Math.max(0, n - 1))}
              disabled={i === 0}
              className={secondaryBtn}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={() => setI((n) => n + 1)}
              className={`${primaryBtn} flex-1 sm:flex-none sm:min-w-36`}
            >
              {i === total - 1 ? "Finish" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </>
      )}

      {!done && !rescue && (
        <button
          onClick={() => setRescue(true)}
          className="mx-auto flex min-h-11 items-center gap-2 text-sm font-medium text-rust underline-offset-2 hover:underline"
        >
          <LifeBuoy className="h-4 w-4" />
          Something went wrong?
        </button>
      )}

      {rescue && !done && (
        <RescuePanel
          stepIndex={i}
          onRescue={onRescue}
          onClose={() => setRescue(false)}
        />
      )}
    </div>
  );
}