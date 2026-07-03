# Coding Practice AI

An adaptive coding-interview trainer: pattern-based practice problems, a real multi-language judge (TypeScript, Python, Java), an AI tutor that gives Socratic hints instead of answers, and spaced-repetition mastery tracking that decides what you should practice next.

This is **not** a wrapper around a chat window. The judge runs your actual code against generated hidden test suites (including a dual-oracle brute-force cross-check to catch bugs the obvious tests miss), and the tutor is scoped to nudge you toward the next insight rather than hand you a solution.

## Quick start

Requires [Bun](https://bun.sh/), Python 3, and a JDK already on `PATH` (see [Requirements](#requirements)).

```bash
bun install
echo 'DATABASE_URL="file:./dev.db"' > .env
printf 'ANTHROPIC_API_KEY=sk-ant-...\nDATABASE_URL="file:./dev.db"\n' > .env.local  # add your real key
bunx prisma migrate deploy
bun seed && bun prisma/seed-authored.ts
bun dev
```

App runs at `http://localhost:3000`. See [Setup](#setup) below for why `DATABASE_URL` needs to be in two files.

## Features

- **Multi-language judge** — write and run solutions in TypeScript, Python, or Java against real test cases, no sandboxing shortcuts.
- **AI tutor** — Claude-powered, gives progressively stronger hints on request instead of solving the problem for you.
- **Mastery tracking** — attempts are scored and scheduled with spaced repetition, so the app tells you what to revisit and when.
- **Pattern curriculum** — problems are organized by algorithmic pattern (arrays & hashing, two pointers, sliding window, trees, graphs, DP, etc.), not just a flat list.

## A note on problem sources

Problem prompts here are intentionally minimal — a title and a link to the original source (NeetCode / LeetCode). Full problem text isn't reproduced; open the link to read the actual prompt before you start. The value here is the judge, the tutor, and the practice loop, not the problem statements themselves.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) + React + TypeScript
- [Prisma](https://www.prisma.io/) + SQLite for problem/attempt/progress data
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the code editor
- [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript) (Claude) for the tutor
- [Bun](https://bun.sh/) for running/judging TypeScript and orchestrating the multi-language harness

## Requirements

This app executes submitted code directly on the host — it needs a real, persistent machine (not a serverless platform):

- [Bun](https://bun.sh/) (JS/TS runtime + test runner)
- Python 3 (`python3` on `PATH`)
- A JDK (`java` / `javac` on `PATH`)
- Node.js (for Next.js itself)

## Setup

```bash
bun install

# Prisma's CLI only reads .env (not .env.local), so DATABASE_URL needs to be
# in both files — .env for `prisma migrate`/`seed`, .env.local for `next dev`.
# .env
DATABASE_URL="file:./dev.db"

# .env.local
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL="file:./dev.db"

bunx prisma migrate deploy
bun seed                    # seeds the 102 vendored problems
bun prisma/seed-authored.ts # seeds the 49 authored problems (tries, DP, bit manipulation, etc.)

bun dev
```

The dev/start scripts automatically rebuild the generated test-case corpus (`prisma/build-cases.ts`) before running — see [`docs/multi-language-judging.md`](docs/multi-language-judging.md) for how the judging pipeline works under the hood.

## Scripts

| Command | Description |
|---|---|
| `bun dev` | Start the dev server |
| `bun run build` | Production build |
| `bun run start` | Start the production server |
| `bun seed` | Seed patterns/problems into the database |
| `bun test:unit` | Run unit tests |
| `bun run build:cases --force` | Force-rebuild the generated hidden test-case corpus |
