// Bridges Nexor's bot identity to a Bloub plush profile (shape + eyes + state).
// The felt plush characters come from @norbert_bodziony/bloub (MIT); this file holds
// only the small, framework-agnostic mapping logic — no Solid, no JSX.
import { SHAPES, EXPRESSIONS, POSES, type ExpressionId } from "@norbert_bodziony/bloub";
import type { PlushState } from "@norbert_bodziony/bloub/plush";
import { MAUS_COLORS, type MausColor, type MausState } from "@/lib/mascot";

// Bloub has no "goutte" plush, so drop it from the pool.
const SHAPE_IDS = SHAPES.map((s) => s.id).filter((id) => id !== "goutte");
const EXPRESSION_IDS: ExpressionId[] = EXPRESSIONS.map((e) => e.id);

/** FNV-1a — same stable hash Bloub uses, so a given seed always draws the same plush. */
function stableIndex(value: string, length: number): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0) % length;
}

export interface PlushProfile {
  shape: string;
  expression: ExpressionId;
}

/** The plush body shape and resting eyes that a bot (by name/seed) always gets. */
export function plushProfile(seed: string): PlushProfile {
  const key = seed || "nexor";
  return {
    shape: SHAPE_IDS[stableIndex(`${key}:shape`, SHAPE_IDS.length)] ?? SHAPE_IDS[0],
    expression: EXPRESSION_IDS[stableIndex(`${key}:expression`, EXPRESSION_IDS.length)] ?? EXPRESSION_IDS[0],
  };
}

/** A `#rrggbb` colour Bloub can draw, from Nexor's named colour. */
export function bloubColor(color: MausColor): string {
  if (color === "chrome" || color === "silver") return "#a8b2bd";
  return MAUS_COLORS[color] ?? MAUS_COLORS.green;
}

export interface PlushMood {
  state: PlushState;
  expression: ExpressionId | null;
  busy: boolean;
}

/** Map Nexor's rich mascot state to the plush's smaller state + eye set. */
export function plushMoodFor(state: MausState | undefined): PlushMood {
  switch (state) {
    case "working":
    case "thinking":
    case "loading":
      return { state: "thinking", expression: "attentif", busy: true };
    case "alerting":
    case "surprised":
      return { state: "notify", expression: "curieux", busy: false };
    case "sad":
      return { state: "failed", expression: null, busy: false };
    case "happy":
    case "celebrate":
    case "proud":
      return { state: "idle", expression: "heureux", busy: false };
    default:
      return { state: "idle", expression: null, busy: false };
  }
}

/** The still pose for a given plush state, for frozen (non-animated) rendering. */
export function frozenPose(state: PlushState): number {
  const key = state === "wink" || state === "wide" || state === "notify" ? state : "idle";
  return POSES[key] ?? 0;
}
