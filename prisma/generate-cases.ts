// Build judging/problems/<id>.json (curated cases + generated/stress cases).
//
//   bun prisma/generate-cases.ts <slug> [slug...]     (or import { generateFor })
//
// judging/curated/<id>.json is the committed source of truth (manifest +
// hand-authored cases); judging/problems/ is a gitignored build artifact —
// prisma/build-cases.ts rebuilds anything missing on server start.
//
// Each slug needs judging/generators/<slug>.ts plus a reference solution,
// resolved in order: prisma/refs/<slug>.ts, authored/<slug>/index.ts,
// vendor/neetcode-150/*/<slug>/index.ts (extractor-verified problems only).
//
// Kinds:
// - function:  generator exports cases(rng) -> {name, args}[], optional
//   stress(rng) (ref-only expected) and brute(...args) (independent second
//   oracle; every non-stress case must agree under the manifest comparator).
// - sequence:  generator exports cases(rng) -> {name, steps: {method, args}[]}
//   (no expected); the driver replays steps on the ref class to fill expected,
//   and cross-checks each step against the generator's `bruteClass`.
// - roundtrip: generator exports cases(rng) -> {name, data}[]; roundtrip cases
//   are self-checking (decode(encode(data)) == data), no oracle needed.
//
// Deterministic (RNG seeded from the slug) and idempotent (previously
// generated "gen:"/"stress:" cases are replaced).

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { makeRng, seedFor } from "../judging/generators/_rng";
import { deserializeArg, serializeResult } from "../harnesses/typescript/serde";
import { compare } from "../harnesses/typescript/comparators";
import type { Manifest } from "../lib/judging";

const ROOT = join(import.meta.dir, "..");
const deepCopy = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

type FnCase = { name: string; args: unknown[]; expected: unknown };
type Step = { method: string; args: unknown[]; expected?: unknown };

function resolveRef(slug: string): string | null {
  const candidates = [
    join(ROOT, "prisma", "refs", `${slug}.ts`),
    join(ROOT, "authored", slug, "index.ts"),
  ];
  const vendor = join(ROOT, "vendor", "neetcode-150");
  if (existsSync(vendor)) {
    for (const pat of readdirSync(vendor)) {
      candidates.push(join(vendor, pat, slug, "index.ts"));
    }
  }
  return candidates.find((p) => existsSync(p)) ?? null;
}

// Replay a sequence case on a class, returning steps with expected filled.
function replay(Cls: new (...a: unknown[]) => Record<string, unknown>, steps: Step[]): Step[] {
  let inst: Record<string, unknown> | null = null;
  return steps.map((s) => {
    if (s.method === "constructor") {
      inst = new Cls(...deepCopy(s.args));
      return { method: s.method, args: s.args, expected: null };
    }
    const fn = inst![s.method] as (...a: unknown[]) => unknown;
    const ret = fn.apply(inst, deepCopy(s.args));
    return { method: s.method, args: s.args, expected: ret === undefined ? null : ret };
  });
}

export async function generateFor(slug: string): Promise<boolean> {
  const curatedPath = join(ROOT, "judging", "curated", `${slug}.json`);
  const outPath = join(ROOT, "judging", "problems", `${slug}.json`);
  const genPath = join(ROOT, "judging", "generators", `${slug}.ts`);
  // curated file is canonical; fall back to an existing built file (gen cases
  // are stripped below either way)
  const basePath = existsSync(curatedPath) ? curatedPath : outPath;
  if (!existsSync(basePath)) {
    console.error(`${slug}: no curated or built case file`);
    return false;
  }
  mkdirSync(join(ROOT, "judging", "problems"), { recursive: true });
  const manifest = JSON.parse(readFileSync(basePath, "utf8")) as Manifest & {
    cases: { name: string }[];
  };
  if (!existsSync(genPath)) {
    // no generator: the built file is just the curated content
    writeFileSync(outPath, JSON.stringify(manifest, null, 2) + "\n");
    console.log(`${slug}: ${manifest.cases.length} curated (no generator)`);
    return true;
  }
  const gen = await import(genPath);
  const rng = makeRng(seedFor(slug));
  const out: { name: string }[] = [];

  if (manifest.kind === "roundtrip") {
    for (const c of gen.cases(rng) as { name: string; data: unknown }[]) {
      out.push({ name: `gen: ${c.name}`, ...{ data: c.data } });
    }
  } else {
    const refPath = resolveRef(slug);
    if (!refPath) {
      console.error(`${slug}: no reference solution found`);
      return false;
    }
    const refMod = (await import(refPath)) as Record<string, unknown>;

    if (manifest.kind === "sequence") {
      const Cls = refMod[manifest.class!] as new (...a: unknown[]) => Record<string, unknown>;
      if (typeof Cls !== "function") {
        console.error(`${slug}: ref does not export class ${manifest.class}`);
        return false;
      }
      const Brute = gen.bruteClass as typeof Cls | undefined;
      for (const c of gen.cases(rng) as { name: string; steps: Step[] }[]) {
        const steps = replay(Cls, c.steps);
        if (Brute) {
          const bruteSteps = replay(Brute, c.steps);
          for (let i = 0; i < steps.length; i++) {
            if (!compare("exact", steps[i].expected, bruteSteps[i].expected)) {
              console.error(`${slug}: ORACLE DISAGREEMENT on "${c.name}" step ${i} (${steps[i].method})`);
              console.error(`  ref=${JSON.stringify(steps[i].expected)} brute=${JSON.stringify(bruteSteps[i].expected)}`);
              return false;
            }
          }
        }
        out.push({ name: `gen: ${c.name}`, ...{ steps } });
      }
    } else {
      // bare function export, or a method on an exported Solution class
      let ref = refMod[manifest.entry!] as (...a: unknown[]) => unknown;
      if (typeof ref !== "function") {
        const Sol = refMod["Solution"] as (new () => Record<string, unknown>) | undefined;
        if (Sol) {
          const inst = new Sol();
          const m = inst[manifest.entry!];
          if (typeof m === "function") ref = (m as (...a: unknown[]) => unknown).bind(inst);
        }
      }
      if (typeof ref !== "function") {
        console.error(`${slug}: ref does not export ${manifest.entry}`);
        return false;
      }
      const argTypes = manifest.argTypes ?? [];
      const invokeRef = (args: unknown[]): unknown => {
        const live = deepCopy(args).map((v, i) => deserializeArg(v, argTypes[i] ?? "any"));
        const raw = ref(...live);
        const src = manifest.resultFrom !== undefined ? live[manifest.resultFrom] : raw;
        return serializeResult(src, manifest.returnType ?? "any");
      };

      for (const c of gen.cases(rng) as { name: string; args: unknown[] }[]) {
        const expected = invokeRef(c.args);
        if (gen.brute) {
          const bruteExpected = (gen.brute as (...a: unknown[]) => unknown)(...deepCopy(c.args));
          if (!compare(manifest.comparator, expected, bruteExpected)) {
            console.error(`${slug}: ORACLE DISAGREEMENT on "${c.name}"`);
            console.error(`  args  = ${JSON.stringify(c.args).slice(0, 300)}`);
            console.error(`  ref   = ${JSON.stringify(expected).slice(0, 300)}`);
            console.error(`  brute = ${JSON.stringify(bruteExpected).slice(0, 300)}`);
            return false;
          }
        }
        out.push({ name: `gen: ${c.name}`, args: c.args, expected } as FnCase & { name: string });
      }

      for (const c of (gen.stress?.(rng) ?? []) as { name: string; args: unknown[] }[]) {
        const t0 = performance.now();
        const expected = invokeRef(c.args);
        const ms = Math.round(performance.now() - t0);
        if (ms > 2000) console.warn(`${slug}: stress "${c.name}" took ${ms}ms in the TS ref — may be too big for Python`);
        out.push({ name: `stress: ${c.name}`, args: c.args, expected } as FnCase & { name: string });
      }
    }
  }

  const kept = manifest.cases.filter(
    (c) => !c.name.startsWith("gen: ") && !c.name.startsWith("stress: "),
  );
  manifest.cases = [...kept, ...out] as typeof manifest.cases;
  const manifestPath = outPath;
  // Compact one-line-per-case format: pretty-printing a 100k-element stress
  // array puts every number on its own line and 10x-es the file size.
  const { cases: allCases, ...head } = manifest;
  const body = allCases.map((c) => "    " + JSON.stringify(c)).join(",\n");
  const headJson = JSON.stringify(head, null, 2).replace(/\n}$/, "");
  writeFileSync(manifestPath, `${headJson},\n  "cases": [\n${body}\n  ]\n}\n`);
  const bytes = Math.round(readFileSync(manifestPath, "utf8").length / 1024);
  const oracle =
    manifest.kind === "roundtrip" ? "self-checking" : manifest.kind === "sequence"
      ? (gen.bruteClass ? "bruteClass" : "NO-BRUTE")
      : (gen.brute ? "brute" : "NO-BRUTE");
  console.log(`${slug}: ${kept.length} curated + ${out.length} generated (${bytes} KB, oracle=${oracle})`);
  return true;
}

if (import.meta.main) {
  const slugs = process.argv.slice(2);
  if (!slugs.length) {
    console.error("usage: bun prisma/generate-cases.ts <slug> [slug...]");
    process.exit(2);
  }
  let ok = true;
  for (const slug of slugs) ok = (await generateFor(slug)) && ok;
  process.exit(ok ? 0 : 1);
}
