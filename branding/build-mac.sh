#!/usr/bin/env bash
# =============================================================
# build-mac.sh — Gera o instalador .dmg do Nexor NUM MAC
# =============================================================
# Uso (no Terminal do Mac, dentro da pasta do projeto):
#     bash branding/build-mac.sh
#
# O que ele faz, sozinho:
#   1. Garante pnpm 10.33.0 (via corepack)
#   2. Instala as dependências
#   3. Compila o app e empacota o .dmg (unsigned)
#   4. Mostra onde o .dmg ficou
#   5. Se o 'gh' estiver logado, já publica o .dmg na release nexor-v0.1.155
# =============================================================
set -euo pipefail

cd "$(dirname "$0")/.."   # vai pra raiz do projeto
echo "==> Pasta do projeto: $(pwd)"

# --- 1. Node + pnpm ---
if ! command -v node >/dev/null 2>&1; then
  echo "!! Node.js não encontrado. Instale o Node 24+ antes (ex.: 'brew install node@24' ou https://nodejs.org)."
  exit 1
fi
echo "==> Node: $(node -v)"

echo "==> Preparando pnpm 10.33.0 (via corepack)..."
corepack enable >/dev/null 2>&1 || true
corepack prepare pnpm@10.33.0 --activate >/dev/null 2>&1 || true
echo "==> pnpm: $(pnpm -v)"

# --- 2. Dependências ---
echo "==> Instalando dependências (pode demorar na 1ª vez)..."
pnpm install --frozen-lockfile

# --- 3. Build + empacotar .dmg (sem assinatura Apple) ---
echo "==> Compilando e empacotando o .dmg... (uns 15-25 min)"
export CSC_IDENTITY_AUTO_DISCOVERY=false   # sem certificado Apple -> build unsigned
export OMB_SKIP_HOOKS=1
pnpm package:mac

# --- 4. Mostrar resultado ---
echo ""
echo "==> PRONTO! Instalador(es) gerado(s):"
ls -lh release/*.dmg || { echo "!! Nenhum .dmg encontrado em release/"; exit 1; }
DMG="$(ls -t release/*.dmg | head -n1)"
echo "==> Arquivo principal: $DMG"

# --- 5. Publicar na release (se o gh estiver logado) ---
if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  echo "==> gh logado — publicando o .dmg na release nexor-v0.1.155..."
  gh release upload nexor-v0.1.155 "$DMG" --clobber -R mkvinicius/nexor
  echo "==> Publicado! Veja em: https://github.com/mkvinicius/nexor/releases/tag/nexor-v0.1.155"
else
  echo "==> (gh não logado) — o .dmg está em $DMG. Para publicar depois:"
  echo "    gh release upload nexor-v0.1.155 \"$DMG\" --clobber -R mkvinicius/nexor"
fi

echo ""
echo "===================  CONCLUÍDO  ==================="
