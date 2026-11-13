<div align="center">

# Nexor

**Seu próprio time de agentes de IA, num app de chat.**

Cada bot na barra lateral é um agente de verdade — **Claude** ou **Codex** rodando localmente —
com a própria personalidade, o próprio modelo e os próprios apps conectados.
Fale com eles como contatos. Veja-os trabalhar. Aprove o que importa.

![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Electron](https://img.shields.io/badge/Electron-macOS%20%C2%B7%20Windows%20%C2%B7%20Ubuntu-2B2E3A?logo=electron&logoColor=9FEAF9)
![Agents](https://img.shields.io/badge/agents-Claude%20·%20Codex-d97757)

</div>

---

## O que é

Nexor é um app de chat **local-first** para orquestrar um time de agentes de IA. Cada agente
aparece como um contato na barra lateral, com um **mascote de pelúcia** próprio, e trabalha por baixo
com a CLI de um agente real (`claude`, `codex` ou `grok`) instalada e logada na sua máquina.

- 🧸 **Mascotes de feltro** — cada agente ganha um bonequinho de pelúcia animado e único.
- 🤖 **Agentes de verdade** — Claude/Codex rodando localmente, não um wrapper de API.
- 💬 **Chat como contatos** — converse, delegue tarefas e acompanhe o trabalho.
- 🔌 **Apps conectados** — integrações opcionais (Composio), computadores na nuvem (Boat) e voz (ElevenLabs/Fish Audio).
- 🖥️ **Desktop** — Electron para macOS, Windows e Ubuntu.

## Rodar em modo de desenvolvimento

Pré-requisitos: **Node ≥ 24**, **pnpm**, e ao menos uma CLI de agente logada (`claude`, `codex` ou `grok`).

```bash
pnpm install
# três terminais, na pasta do projeto:
pnpm dev:server    # servidor harness
pnpm dev           # app (Vite)
pnpm dev:desktop   # shell Electron
```

## Gerar o instalador

```bash
pnpm package:win     # Windows  → release/Nexor-<versão>-setup.exe
pnpm package:mac     # macOS    → release/Nexor-<versão>.dmg   (precisa de um Mac)
pnpm package:linux   # Linux    → release/*.deb / *.AppImage
```

> O instalador do macOS **só pode ser compilado em um Mac** (ferramentas e assinatura da Apple).

## Créditos e licença

Nexor é um **rebrand pessoal** de **[OpenMausBot](https://github.com/milind-soni/OpenMausBot)**,
criado por **Milind Soni** e licenciado sob **Apache-2.0**. O código, a licença (`LICENSE`) e o
aviso de atribuição (`NOTICE`) do projeto original são preservados conforme a licença exige.

Os mascotes de pelúcia usam a biblioteca **[Bloub](https://github.com/NorbertBodziony/bloub)**
(`@norbert_bodziony/bloub`), de Jérémy Perret, licenciada sob **MIT**.

Este projeto não é afiliado a xAI, Meta, OpenAI ou Manus.
