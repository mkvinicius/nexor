# 🍎 APLICAR-NO-MAC — 3 correções a aplicar sobre a base 0.1.165

> **Para o Claude Code rodando no Mac (base atual = `main` / 0.1.165):**
> Aplique as 3 correções abaixo. Elas foram implementadas e testadas na base antiga 0.1.155 (branch de referência `backup-avatar-features-0115`), mas na 0.1.165 alguns arquivos MUDARAM DE LUGAR — então **reaplique o padrão** lendo os arquivos atuais, não faça cherry-pick cego.
>
> **Branch de referência (minha implementação completa na 0.1.155):** `backup-avatar-features-0115` no GitHub (`mkvinicius/nexor`). Use `git show backup-avatar-features-0115 -- <arquivo>` e `git log backup-avatar-features-0115` (3 commits: branding, avatarColor, avatarIcon) pra ver exatamente o que foi feito e copiar o padrão.
>
> **Build:** `pnpm build` (= `tsc -b && tsc -p tsconfig.server.json && vite build`). **Push:** precisa de `OMB_SKIP_HOOKS=1 git push`. Faça um commit por correção.

---

## Correção 1 — Nome do bot padrão "MausBot" → "Nexor" (+ resquícios visíveis)

Na 0.1.165, o arquivo `shared/default-bot.ts` virou só um re-export. O nome real está agora em:

**`packages/phone-protocol/src/default-bot.ts`** → `export const DEFAULT_BOT_NAME = "MausBot";` → trocar para `"Nexor"`.

Depois, procure outros "MausBot" HARDCODED e VISÍVEIS (não testes, não comentários, não `.d.ts`, não protocolo `openmausbot://`). Rodar:
```bash
rg -n "MausBot" src packages --glob '!**/*.test.*' --glob '!**/*-preview.tsx'
```
Candidatos conhecidos (confirme os caminhos na 0.1.165 — podem ter movido):
- Fallbacks `?? "MausBot"` em componentes de intro do helper (ex.: `HelperIntro.tsx`, `SimpleHelperIntro.tsx`) → trocar para `"Nexor"`.
- `"MausBot Cloud"` como fallback de nome de plano (ex.: `cloud-plan.ts`) → `` `${productName()} Cloud` `` (productName vem de `@/lib/brand`).
- `placeholder="MausBot"` e `botLabel={name || "MausBot"}` na tela de boas-vindas (`MausBotCustomize.tsx`) → `"Nexor"`.
- User-Agent `` `MausBot/${appVersion()}` `` (`app-host-context.ts`) → `"Nexor"`.

Veja o commit de branding na branch de referência: `git show backup-avatar-features-0115 -- shared/default-bot.ts src/lib/cloud-plan.ts`.

---

## Correção 2 — Cor personalizada (hex) no avatar: campo `avatarColor?: string | null`

Campo aditivo e opcional. Quando presente e válido (`#rrggbb`), sobrepõe o hex derivado do enum `color`; ausente → comportamento atual. **Threading por TODAS as camadas** (procure "avatarColor" na branch de referência pra ver cada edição):

- **`shared/bot-avatar.ts`**: `avatarColorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/, ...)` e `avatarColorHex(value): string|undefined` (lowercase ou undefined). Espelha `mascotFaceColorSchema`/`mascotFaceInk`.
- **`shared/wire.ts`** (`WireBot`): `avatarColor?: string | null;`. NÃO listar em `BotWirePrivateKeys`.
- **`src/state/store.tsx`** (`Bot`): `avatarColor?: string | null;`.
- **`server/bot-profile.ts`**: `"avatarColor"` em `BOT_PROFILE_PATCH_FIELDS`; `avatarColor: avatarColorSchema.nullable().optional()` no `profilePatchSchema`; `"avatarColor"` no Pick de `BotProfilePatch`; mensagem de erro amigável.
- **`server/request-auth.ts`**: `"avatarColor"` em `CLIENT_BOT_PATCH_FIELDS` e `SHARED_LOOK_FIELDS`.
- **`electron/cloud-send-parts.mjs`**: `"avatarColor"` em `BOT_PARTS.look`.
- **`src/state/bot-patch-queue.ts`** (`BotUpdatePatch`) e **`src/components/avatar-editing.tsx`** (`AvatarPatch`; incluir `avatarColor: null` em `RESET_MASCOT_PATCH`).
- **Render**: `src/components/Avatar.tsx` (props de `BotAvatar`/`MausAvatar` repassam `avatarColor` a `PlushAvatar` e `CarvedAvatar`); `src/components/PlushAvatar.tsx` → `color: avatarColorHex(avatarColor) ?? bloubColor(color)`; `src/components/CarvedAvatar.tsx` → `carvedFills` usa o hex quando presente.
- **Pickers**: `src/components/BotProfileAvatarCard.tsx` e `src/components/MausBotCustomize.tsx` → adicionar `<input type="color">` (+ botão "Clear" → `avatarColor: null`) ao lado da grade de cores; swatch do enum deixa de ficar selecionado quando `avatarColor` está setado.
- **Testes**: `server/bot-profile.test.ts` (allowlist estrito) — adicionar `avatarColor` + casos válido `#aabbcc`/`null` e inválidos.

**Invariantes:** `botWireProjectionIsExact` (adicionar em `WireBot` basta); allowlist estrito de `bot-profile` (obrigatório senão devices pareados dão erro); permissões `SHARED_LOOK_FIELDS`; cloud sync `BOT_PARTS.look` (senão não sincroniza).

---

## Correção 3 — Ícone (glyph) no avatar: campo `avatarIcon?: string | null`

Mesma estrutura do `avatarColor`. Lista FECHADA de ícones `lucide-react`; precedência **FOTO > ÍCONE > MASCOTE**; o ícone herda a cor resolvida (`avatarColorHex(bot.avatarColor) ?? bloubColor(bot.color)`).

- **`shared/bot-avatar.ts`**: `BOT_AVATAR_ICONS = [...] as const` (lista fechada; na 0.1.155 usei 39 nomes confirmados em lucide 0.539: Sparkles, Bot, Star, Zap, Heart, Rocket, Bell, Cloud, Compass, Flame, Ghost, Gift, Globe, Leaf, Moon, Sun, Music, Palette, PawPrint, Smile, Crown, Diamond, Feather, Flower, Coffee, Camera, Code, Cpu, Database, Gamepad2, Headphones, Wand2, Brain, Atom, Anchor, Bird, Cat, Dog, Fish) + `avatarIconSchema = z.enum(BOT_AVATAR_ICONS)`. **Confirme que cada nome existe na versão de lucide da 0.1.165.**
- **`shared/wire.ts`**, **`src/state/store.tsx`**, **`server/bot-profile.ts`**, **`server/request-auth.ts`**, **`electron/cloud-send-parts.mjs`**, **`src/state/bot-patch-queue.ts`**, **`src/components/avatar-editing.tsx`**: adicionar `avatarIcon` exatamente como `avatarColor`.
- **`src/lib/avatar-icons.ts`** (NOVO): mapa `Record<string, LucideIcon>` com imports ESTÁTICOS (nunca `import()` por string) só dos ícones da lista + `avatarIconComponent(name)`.
- **`src/components/Avatar.tsx`**: ampliar `BotAvatarOutcome` com `"icon"`; `resolveBotAvatarOutcome` recebe `hasIcon` e aplica precedência foto>ícone>mascote; branch `outcome==="icon"` renderiza o glyph centralizado (mesmo tamanho/raio do ramo de imagem) colorido. Comentário `// TODO(iOS parity): mirror 'icon' outcome` (o espelho Swift não está nesta árvore).
- **Picker**: só em `src/components/BotProfileAvatarCard.tsx` — seção "Icon" (grade) → `onPatch({ avatarIcon: name, avatarCrop: "mascot", avatarUrl: null })` + botão "None" → `avatarIcon: null`. (Pode adiar o picker na tela de boas-vindas.)
- **Testes**: `server/bot-profile.test.ts` (allowlist) + casos de precedência em `src/components/Avatar.test.ts`.

> Nota: na 0.1.155, `Avatar.test.ts` já tinha 9 falhas PRÉ-EXISTENTES (mascote de feltro não renderiza SVG sob `renderToStaticMarkup`/jsdom) — do port de feltro, não dessas correções. Verifique se na 0.1.165 isso ainda ocorre e não confunda com regressão.

---

## Ordem e verificação

1. Correção 1 → `pnpm build` → commit.
2. Correção 2 (cor) → `pnpm build` → commit.
3. Correção 3 (ícone) → `pnpm build` → commit.
4. `OMB_SKIP_HOOKS=1 git push`.
5. Reempacotar: Windows (`pnpm package:win`, numa máquina Windows) e Mac (`pnpm package:mac`), e republicar na release corrente (0.1.165).

Tudo aditivo e retrocompatível: bots antigos sem os campos novos = comportamento idêntico.
