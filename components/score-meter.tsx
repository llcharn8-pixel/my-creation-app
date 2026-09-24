"use client";

import { evaluateContent, type ScoreInput } from "@/lib/ai/score";

export function ScoreMeter(props: ScoreInput) {
  const { score, hints } = evaluateContent(props);
  const tone =
    score >= 70
      ? "bg-green-500"
      : score >= 40
        ? "bg-amber-500"
        : "bg-red-400";

  return (
    <div className="space-y-2 rounded-md border border-neutral-200 p-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-neutral-700">Live score</h3>
        <span className="text-sm font-semibold">{score}/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
        <div
          className={`h-full ${tone} transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
      {hints.length > 0 ? (
        <ul className="list-disc space-y-0.5 pl-5 text-xs text-neutral-600">
          {hints.slice(0, 4).map((h) => (
            <li key={h}>{h}</li>
          ))}
          {hints.length > 4 && (
            <li className="list-none text-neutral-400">
              +{hints.length - 4} more
            </li>
          )}
        </ul>
      ) : (
        <p className="text-xs text-green-700">
          Every criterion is covered. Nice work.
        </p>
      )}
    </div>
  );
}
