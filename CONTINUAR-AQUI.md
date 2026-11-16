# 🧭 CONTINUAR-AQUI — Nexor (ponto de retomada)

> **Para qualquer sessão (Claude Code, outra janela, ou a VPS):** leia este arquivo primeiro.
> Ele contém o que é o projeto, tudo que já foi feito, onde paramos e o próximo passo exato.
> **Última atualização:** 2026-11-16 (no Mac).


---

## 0. ATUALIZAÇÃO 2026-11-16 (feita no Mac) — leia isto primeiro

- **Nexor = 0.1.165** (merge do OpenMausBot 0.1.165, 898 commits). Commit do merge `9eea764c1`; main em `888e453e7`.
- **Release `nexor-v0.1.165` publicada** com o Mac: `Nexor-0.1.165-arm64.dmg` (Apple Silicon) e `Nexor-0.1.165-x64.dmg` (Intel), mais os `.zip`, blockmaps e `latest-mac.yml` (atualização automática). Sem assinatura Apple (abrir com botão direito > Abrir na 1ª vez). **Abertura do app não foi testada** nesta sessão; o bundle (Nexor.app, com.nexor.app, arm64) foi conferido.
- **Windows:** o `.exe` continua só na release 0.1.155. Para atualizar: no Windows, `git pull`, `pnpm install --frozen-lockfile`, `pnpm package:win`, e `gh release upload nexor-v0.1.165 release/Nexor-0.1.165-setup.exe release/latest.yml`.
- **Correções:** o rebrand anterior renomeou CHAVES de tradução (`pair.thisOpenMausBot` → `pair.thisNexor` etc.) sem mudar o código, e esses textos saíam vazios. Agora as chaves são as do upstream e só os VALORES trocam "OpenMausBot/MausBot" por "Nexor". O `electron-builder.yml` apontava a atualização automática para `nexor-app/Nexor` (não existe); agora aponta para `mkvinicius/nexor`. O nome do `.dmg` era "OpenMausBot"; agora "Nexor".
- **Clone no Mac:** `/Users/maikonviniciussilva/projetos/Nexor` (remoto `upstream` = OpenMausBot). Node arm64 em `/Users/maikonviniciussilva/projetos/Nexo/.nexo/isolated/tools/node/v24.22.2/bin` (com `corepack pnpm`; não há `pnpm` global, o `package:mac` precisa de um atalho `pnpm` no PATH).

### Rotina para a próxima versão do OpenMausBot
1. `git fetch upstream main && git merge upstream/main`.
2. Conflitos esperados: `src/locales/*.json` → pegar a versão do upstream e trocar `OpenMausBot`/`MausBot` → `Nexor` **só nos valores** (nunca nas chaves); `README.md` → manter o do Nexor; `src/components/Avatar.tsx` → manter o `PlushAvatar`; `electron-builder.yml` → conferir `dmg.artifactName`, `publish` e os `NS*UsageDescription`.
3. `corepack pnpm install --frozen-lockfile`, `corepack pnpm typecheck`, `corepack pnpm lint`.
4. Hashes das traduções: o `--check` reclama "English source changed" para as chaves com a marca; re-registrar o hash dessas chaves em `src/locales/source-hashes.json` com o sha256 do inglês atual (só as que contêm "Nexor"). Guardas: `src/locales/vocabulary.test.ts` (allow-list com "Nexor introduced me").
5. Build: `CSC_IDENTITY_AUTO_DISCOVERY=false OMB_SKIP_HOOKS=1 pnpm package:mac` (15–25 min) → `release/`.
6. `git push`; `gh release create nexor-v<versão> release/Nexor-*.dmg release/Nexor-*.zip release/*.blockmap release/latest-mac.yml -R mkvinicius/nexor`.

---

## 1. O que é o projeto

**Nexor** = app local-first de chat multi-agente (alternativa open-source ao "Grok Bot"), onde **cada bot é um agente de IA real** (Claude / Codex / Grok) rodando por baixo.

- É um **rebrand** do projeto open-source **OpenMausBot** (autor Milind Soni, Apache-2.0), clonado de https://github.com/milind-soni/OpenMausBot.
- Versão: **0.1.165** (era 0.1.155 até 2026-11-16).
- Stack: **TypeScript + React 19 + Vite + Electron**, monorepo **pnpm** (`pnpm@10.33.0`), engine **Node ≥ 24**.
- Repositório do usuário (**público**): https://github.com/mkvinicius/nexor (conta `mkvinicius`, plano free).
- Pasta local (Windows): `C:\Users\USER\OpenMausBot`

> Requer um CLI de agente logado na máquina (`claude`, `codex` ou `grok`) pra funcionar.

---

## 2. Objetivo atual

Deixar o Nexor **pronto pra baixar e instalar**, com instaladores publicados no GitHub Releases, para **Windows** e **Mac** — de forma que o usuário (que não é técnico) só precise baixar e dar dois cliques.

---

## 3. O que JÁ FOI FEITO ✅

1. **Rebrand OpenMausBot → Nexor** — nome, locales (16 idiomas), ícone "N" azul, electron-builder. (commit `5a6d56e3a`)
2. **Plush do OpenBot portado** — avatares dos agentes viraram mascotes de feltro (Bloub).
3. **Instalador Windows gerado e validado** — `release/Nexor-0.1.155-setup.exe` (259 MB, NSIS). Executável válido (header MZ), **não-assinado** (sem certificado de code-signing).
4. **Build de produção revalidado** — `pnpm build` passou limpo (1m30s, só warnings de tamanho de chunk, não são erros).
5. **`gh` (GitHub CLI) instalado e logado** como `mkvinicius` (via winget; token PAT reaproveitado do Git Credential Manager; escopos `repo` + `workflow`).
6. **Release Windows PUBLICADA** 🎉
   - Tag: **`nexor-v0.1.155`**
   - URL: **https://github.com/mkvinicius/nexor/releases/tag/nexor-v0.1.155**
   - Asset: `Nexor-0.1.155-setup.exe` (259 MB)
7. **Workflow de build do Mac criado e corrigido** — `.github/workflows/build-mac-nexor.yml` (runner **`macos-13` Intel x64**; gera `.dmg` que roda em Mac Intel nativo e Apple Silicon via Rosetta).

---

## 4. ONDE PARAMOS 🔴 (próximo passo)

**Falta só o instalador do Mac (`.dmg`).**

- Um `.dmg` **só pode ser compilado numa máquina Mac** — não dá no Windows.
- A saída é o **Mac da nuvem do GitHub Actions**, mas a conta `mkvinicius` (free, nova) **estava bloqueada** de usar runner macOS (antifraude do GitHub).
  - `macos-14` → erro imediato "configuration not supported".
  - `macos-13` → fica preso em `queued` sem pegar máquina (chegou a 1h44 na fila).
- ✅ **Ação tomada:** o usuário **adicionou um cartão** no GitHub (`Settings → Billing → Payment information`) em 2026-11-14 pra verificar a conta e destravar o macOS. **Não cobra nada** (repo público = Actions grátis); o cartão só serve pra provar que a conta é real.
- ⏳ **Aguardando propagação** da verificação (de minutos a algumas horas). Último run disparado: **`43623718523`** — estava `queued` sem runner.

### ➡️ O que fazer quando o Mac destravar

Assim que o GitHub reconhecer a conta, o build **começa sozinho** (não precisa redisparar). Se precisar disparar de novo / acompanhar / publicar, use os comandos da seção 6.

Fluxo completo do Mac:
1. Disparar (se necessário): `gh workflow run build-mac-nexor.yml --ref main`
2. Acompanhar até `completed/success`.
3. Baixar o `.dmg`: `gh run download <RUN_ID>` (artifact `Nexor-macos-x64-dmg`).
4. Publicar na release: `gh release upload nexor-v0.1.155 <caminho>/*.dmg`.
5. Atualizar as notas da release trocando "macOS — em breve" pelas instruções de instalação do Mac.
6. Avisar o usuário. ✅ Fim.

---

## 4B. 🍎 PLANO B — GERAR O .DMG NO MAC DE CASA (jeito mais fácil)

> O usuário **tem um Mac em casa**. Quando estiver nele, este é o caminho certo (não depende da fila do GitHub).

**Jeito 1 — via Claude Code no Mac (recomendado p/ o usuário não-técnico):**
Abrir o Claude Code na pasta do projeto no Mac e dizer:
> *"Leia o CONTINUAR-AQUI.md e gere o instalador .dmg do Mac."*

O Claude Code deve então: clonar/atualizar o repo, rodar `bash branding/build-mac.sh`, e publicar o `.dmg` na release.

**Jeito 2 — um comando só no Terminal do Mac:**
```bash
# 1. Pegar o projeto (só na 1ª vez; depois é só 'git pull')
git clone https://github.com/mkvinicius/nexor.git
cd nexor
# 2. Rodar o script que faz TUDO (instala, compila, empacota e publica o .dmg)
bash branding/build-mac.sh
```

O script `branding/build-mac.sh`:
1. Garante o pnpm 10.33.0 (precisa de **Node 24+** já instalado — se não tiver: `brew install node`).
2. Instala dependências.
3. Compila e empacota o `.dmg` **unsigned** (`CSC_IDENTITY_AUTO_DISCOVERY=false`).
4. Mostra o `.dmg` em `release/`.
5. Se o `gh` estiver logado no Mac, **já publica** na release `nexor-v0.1.155`. Se não, mostra o comando pra publicar.

> Observação: o `.dmg` sai **sem assinatura Apple**. Ao abrir no Mac, o macOS mostra "app não verificado" → o usuário clica com o **botão direito no app → Abrir → Abrir** (só na 1ª vez). Pra remover esse aviso de vez, precisa de conta Apple Developer (US$99/ano) — pendência futura.

---

## 5. Como RETOMAR em outra máquina / VPS

```bash
# 1. Clonar (ou atualizar) o repo
git clone https://github.com/mkvinicius/nexor.git
cd nexor
git pull

# 2. Ler este arquivo
cat CONTINUAR-AQUI.md

# 3. Garantir as ferramentas
#    - Node >= 24, pnpm 10.33.0
#    - gh CLI logado:  gh auth status   (se não: gh auth login)
pnpm install --frozen-lockfile

# 4. Checar o status do build do Mac e seguir a seção 4/6
gh run list --workflow build-mac-nexor.yml --limit 5
```

> **Importante:** todo `git push` deste repo precisa de `OMB_SKIP_HOOKS=1` na frente
> (um hook de i18n reclama da fonte em inglês mudada pelo rebrand — é esperado, não é bug).
> Ex.: `OMB_SKIP_HOOKS=1 git push origin main`

---

## 6. Referência de comandos (cola e usa)

```bash
# --- Status do build do Mac ---
gh run list --workflow build-mac-nexor.yml --limit 5
gh run view <RUN_ID>
gh api /repos/mkvinicius/nexor/actions/runs/<RUN_ID>/jobs   # ver se pegou runner

# --- Disparar o build do Mac manualmente ---
gh workflow run build-mac-nexor.yml --ref main

# --- Quando terminar: baixar o .dmg e publicar na release ---
gh run download <RUN_ID>                    # baixa o artifact Nexor-macos-x64-dmg
gh release upload nexor-v0.1.155 *.dmg      # anexa o .dmg na página de download

# --- Rebuild do instalador Windows (só numa máquina Windows) ---
pnpm package:win                            # gera release/Nexor-0.1.155-setup.exe

# --- Ver a release publicada ---
gh release view nexor-v0.1.155
```

---

## 7. Arquivos-chave

| Arquivo | O que é |
|---|---|
| `.github/workflows/build-mac-nexor.yml` | Workflow que gera o `.dmg` do Mac (runner macos-13) |
| `branding/release-notes.md` | Texto da release (instruções de download) |
| `release/Nexor-0.1.155-setup.exe` | Instalador Windows (NÃO vai no git — está no `.gitignore`; distribuído como Release asset) |
| `src/lib/brand.ts`, `server/brand.ts` | Nome do produto (Nexor) |
| `branding/` | Scripts do rebrand, ícones, logs de build |

---

## 8. Pendências futuras (opcional)

- **Assinar os instaladores** (code-signing) pra remover o aviso do SmartScreen no Windows e o "app não verificado" no Mac — exige certificados pagos (Windows ~US$/ano; Apple Developer US$99/ano).
- **Build Mac Apple Silicon nativo (arm64)** além do x64 — quando a conta aceitar `macos-14`.
- **GitHub Actions automático** a cada release (hoje o Mac é disparo manual).

---

*Este arquivo é a fonte da verdade pra retomar o trabalho. Mantê-lo atualizado a cada avanço.*
