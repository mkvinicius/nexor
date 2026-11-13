// A React wrapper that mounts the Solid-based Bloub felt-plush avatar.
// Nexor compiles JSX as React, so we never write Solid JSX here — we mount the
// Solid component through `createComponent` + `render`, which needs no compiler.
import { useEffect, useRef } from "react";
import { render, createComponent } from "@solidjs/web";
import { PlushBot } from "@norbert_bodziony/bloub/plush";
import type { MausColor, MausState } from "@/lib/mascot";
import { bloubColor, frozenPose, plushMoodFor, plushProfile } from "@/lib/bloub-profile";

const AVATAR_FPS = 30;

export interface PlushAvatarProps {
  /** A stable string per bot (its name/id) — picks the shape and resting eyes. */
  seed: string;
  color: MausColor;
  size?: number;
  state?: MausState;
  animated?: boolean;
  title?: string | null;
}

export function PlushAvatar({ seed, color, size = 44, state, animated = true, title }: PlushAvatarProps) {
  const host = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = host.current;
    if (!node || typeof document === "undefined") return;

    const { shape, expression } = plushProfile(seed);
    const mood = plushMoodFor(state);
    const eyes = mood.expression ?? expression;
    const play = animated && mood.busy;

    const props: Record<string, unknown> = {
      size,
      shape,
      color: bloubColor(color),
      expression: eyes,
      state: mood.state,
      eyeScale: 1,
      ariaLabel: title ?? "",
      fps: AVATAR_FPS,
      autoPause: true,
      paused: !play,
    };
    // A resting plush is frozen on its pose; a busy one animates its felt pieces.
    if (!play) props.frozenAt = frozenPose(mood.state);

    // Never let a mascot render fault take down the surrounding UI.
    let dispose: (() => void) | undefined;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dispose = render(() => createComponent(PlushBot as any, props), node);
    } catch {
      return;
    }
    return () => dispose?.();
  }, [seed, color, size, state, animated, title]);

  return (
    <span
      ref={host}
      aria-hidden="true"
      className="inline-flex shrink-0"
      style={{ width: size, height: size }}
    />
  );
}
