import { z } from "zod";

export const MASCOT_FACE_COLORS = ["white", "black"] as const;
export const mascotFaceColorSchema = z.enum(MASCOT_FACE_COLORS);
export type MascotFaceColor = z.infer<typeof mascotFaceColorSchema>;

export function mascotFaceInk(value: unknown): string | undefined {
  const color = mascotFaceColorSchema.safeParse(value).data;
  return color === "white" ? "#ffffff" : color === "black" ? "#000000" : undefined;
}

/** A custom `#rrggbb` avatar colour that overrides the hex derived from the named `color` enum. */
export const avatarColorSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "must be a #rrggbb hex colour");

/** The normalized (lowercase) hex for a custom avatar colour, or undefined when absent/invalid. */
export function avatarColorHex(value: unknown): string | undefined {
  const hex = avatarColorSchema.safeParse(value).data;
  return hex?.toLowerCase();
}

/**
 * A closed list of lucide-react icon names that may stand in as a bot's avatar
 * glyph (coloured with the resolved avatar colour). Kept closed so a persisted
 * profile can never name an arbitrary, unbundled component; every name here is
 * confirmed to exist in the installed lucide-react. Precedence: photo > icon >
 * mascot.
 */
export const BOT_AVATAR_ICONS = [
  "Sparkles", "Bot", "Star", "Zap", "Heart", "Rocket", "Bell", "Cloud",
  "Compass", "Flame", "Ghost", "Gift", "Globe", "Leaf", "Moon", "Sun",
  "Music", "Palette", "PawPrint", "Smile", "Crown", "Diamond", "Feather",
  "Flower", "Coffee", "Camera", "Code", "Cpu", "Database", "Gamepad2",
  "Headphones", "Wand2", "Brain", "Atom", "Anchor", "Bird", "Cat", "Dog",
  "Fish",
] as const;
export const avatarIconSchema = z.enum(BOT_AVATAR_ICONS);
export type BotAvatarIcon = z.infer<typeof avatarIconSchema>;

/**
 * `mascot` draws the animated mascot body, filled with the bot's colour
 * gradient. `circle`, `rounded`, and `square` crop the bot's own image
 * instead, shown as it is, with no mascot at all.
 */
export const BOT_AVATAR_CROPS = ["mascot", "circle", "rounded", "square"] as const;
export const botAvatarCropSchema = z.enum(BOT_AVATAR_CROPS);
export type BotAvatarCrop = z.infer<typeof botAvatarCropSchema>;

/** CSS radius for a profile crop. Mascot is drawn, not photo-cropped, so it is not clipped. */
export function avatarCropRadius(crop: BotAvatarCrop): string {
  if (crop === "circle") return "50%";
  if (crop === "rounded") return "22%";
  return "0";
}

/** 1 shows the picture with object-fit cover. Larger values zoom in. */
export const AVATAR_ZOOM_MIN = 1;
export const AVATAR_ZOOM_MAX = 3;
/** The point of the picture kept in the middle of the crop, from 0 to 1. */
export const AVATAR_FOCUS_CENTER = 0.5;

export function clampAvatarZoom(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number.NaN;
  if (!Number.isFinite(parsed)) return AVATAR_ZOOM_MIN;
  const clamped = Math.min(AVATAR_ZOOM_MAX, Math.max(AVATAR_ZOOM_MIN, parsed));
  return Math.round(clamped * 100) / 100;
}

export function clampAvatarFocus(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number.NaN;
  if (!Number.isFinite(parsed)) return AVATAR_FOCUS_CENTER;
  const clamped = Math.min(1, Math.max(0, parsed));
  return Math.round(clamped * 1000) / 1000;
}

/**
 * Custom avatars are deliberately limited to this app's attachment server.
 * Besides making persisted profiles portable across desktop/browser clients,
 * this prevents a bot profile from becoming an external tracking pixel or a
 * script-capable SVG.
 */
export const botAvatarUrlSchema = z
  .string()
  .regex(
    /^\/api\/attachments\/[A-Za-z0-9-]+\.(?:png|jpg|gif|webp)$/,
    "must be a stored PNG, JPEG, GIF, or WebP attachment",
  );

export function botAvatarUrlFromStoredPath(path: string): string | null {
  const name = path.replaceAll("\\", "/").split("/").pop();
  if (!name) return null;
  const url = `/api/attachments/${name}`;
  return botAvatarUrlSchema.safeParse(url).success ? url : null;
}

/** Runtime-safe defaults for untrusted persisted/SSE profile data. */
export interface BotAvatarProfileInput {
  avatarUrl?: unknown;
  avatarCrop?: unknown;
}

export interface BotAvatarProfile {
  avatarUrl?: string;
  avatarCrop: BotAvatarCrop;
}

export function botAvatarProfile(value: BotAvatarProfileInput): BotAvatarProfile {
  const profile: BotAvatarProfile = {
    avatarCrop: botAvatarCropSchema.safeParse(value.avatarCrop).data ?? "mascot",
  };
  const url = botAvatarUrlSchema.safeParse(value.avatarUrl);
  if (url.success) profile.avatarUrl = url.data;
  return profile;
}
