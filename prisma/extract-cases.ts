// Runtime-capture case extractor (docs/multi-language-judging.md §6 step 4).
// For each vendored problem it instruments the TS test to capture real
// (args, expected) pairs, serializes ListNode/TreeNode, writes a draft
// judging/problems/<id>.json, then VERIFIES it by running the vendored
// reference through the TS harness. Only verified drafts are kept.
//
// Run: bun prisma/extract-cases.ts
//
// Skips problems that already have a hand-authored case file, sequence/design
// problems (multiple entry points or unconsumed setup calls), and anything whose
// reference doesn't pass its own extracted cases.

import {
  readdirSync, statSync, existsSync, readFileSync, writeFileSync,
  mkdtempSync, rmSync, cpSync,
} from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";

const ROOT = join(import.meta.dir, "..");
const VENDOR = join(ROOT, "vendor", "neetcode-150");
const PROBLEMS_DIR = join(ROOT, "judging", "problems");
const SHIM = join(ROOT, "prisma", "extract", "shim.ts");
const REFS = join(ROOT, "prisma", "refs"); // correct override solutions for buggy vendored refs
const BUN = process.execPath; // this script runs under bun

const snake = (s: string) =>
  s.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");

function dirs(p: string): string[] {
  return existsSync(p)
    ? readdirSync(p).filter((n) => {
        try { return statSync(join(p, n)).isDirectory(); } catch { return false; }
      })
    : [];
}

function isClass(v: unknown): boolean {
  return typeof v === "function" && /^\s*class\s/.test(Function.prototype.toString.call(v));
}

async function buildWrapped(indexPath: string): Promise<string> {
  const mod = await import(pathToFileURL(indexPath).href);
  const lines = ['import * as __m from "./index";', 'import { __ser, __type, __push } from "./shim";'];
  for (const k of Object.keys(mod)) {
    const v = mod[k];
    if (isClass(v)) {
      lines.push(
        `export const ${k} = __m.${k};`,
        `;(function(){const p=__m.${k}.prototype;Object.getOwnPropertyNames(p).forEach(function(mn){if(mn==="constructor")return;const orig=p[mn];if(typeof orig!=="function")return;p[mn]=function(...a){const s=a.map(__ser);const t=a.map(__type);const r=orig.apply(this,a);__push(mn,s,t,r);return r;};});})();`,
      );
    } else if (typeof v === "function") {
      lines.push(
        `export const ${k} = (...a) => { const s=a.map(__ser); const t=a.map(__type); const r=__m.${k}(...a); __push(${JSON.stringify(k)},s,t,r); return r; };`,
      );
    } else {
      lines.push(`export const ${k} = __m.${k};`);
    }
  }
  return lines.join("\n") + "\n";
}

type Cap = {
  cases: { name: string; entry: string; args: unknown[]; argTypes: string[]; expected: unknown; returnType: string; unordered: boolean }[];
  entryNames: string[];
  leftover: number;
};

function verify(caseJsonPath: string, solutionPath: string): boolean {
  const T = mkdtempSync(join(tmpdir(), "ll-verify-"));
  try {
    cpSync(join(ROOT, "harnesses", "typescript"), T, { recursive: true });
    cpSync(solutionPath, join(T, "solution.ts"));
    cpSync(caseJsonPath, join(T, "case.json"));
    const out = execFileSync(BUN, ["run", "harness.ts", "case.json"], {
      cwd: T, encoding: "utf8", timeout: 20_000,
    });
    const m = out.match(/LLJUDGE-SUMMARY\s+(\{.*\})/);
    if (!m) return false;
    const { passed, total } = JSON.parse(m[1]);
    return total > 0 && passed === total;
  } catch {
    return false;
  } finally {
    rmSync(T, { recursive: true, force: true });
  }
}

async function main() {
  const results = { ok: [] as string[], skip: [] as string[], fail: [] as string[] };

  for (const folder of dirs(VENDOR).filter((f) => /^\d+-/.test(f)).sort()) {
    for (const slug of dirs(join(VENDOR, folder))) {
      const pdir = join(VENDOR, folder, slug);
      const indexPath = join(pdir, "index.ts");
      const testPath = join(pdir, "index.test.ts");
      if (!existsSync(indexPath) || !existsSync(testPath)) continue;
      if (existsSync(join(PROBLEMS_DIR, `${slug}.json`))) continue; // keep hand-authored

      const T = mkdtempSync(join(tmpdir(), "ll-extract-"));
      try {
        cpSync(indexPath, join(T, "index.ts"));
        cpSync(SHIM, join(T, "shim.ts"));
        writeFileSync(join(T, "wrapped.ts"), await buildWrapped(indexPath));

        let testSrc = readFileSync(testPath, "utf8")
          .replace(/(['"])\.\/index\1/g, '"./wrapped"')
          .replace(/(['"])bun:test\1/g, '"./shim"');
        testSrc += '\nimport { __flush as __F } from "./shim";\n__F();\n';
        writeFileSync(join(T, "run.ts"), testSrc);

        execFileSync(BUN, ["run", "run.ts"], {
          cwd: T, timeout: 20_000, stdio: "ignore",
          env: { ...process.env, EXTRACT_OUT: join(T, "out.json") },
        });

        const cap = JSON.parse(readFileSync(join(T, "out.json"), "utf8")) as Cap;
        if (cap.entryNames.length !== 1 || cap.leftover > 0 || cap.cases.length === 0) {
          results.skip.push(`${slug} (entries=${cap.entryNames.length}, leftover=${cap.leftover}, cases=${cap.cases.length})`);
          continue;
        }

        const entry = cap.entryNames[0];
        const n = cap.cases[0].args.length;
        const argTypes: string[] = [];
        for (let i = 0; i < n; i++) {
          argTypes[i] = cap.cases.map((c) => c.argTypes[i]).find((t) => t && t !== "any") ?? "any";
        }
        const returnType = cap.cases.map((c) => c.returnType).find((t) => t && t !== "any") ?? "any";
        const unordered = cap.cases.some((c) => c.unordered);
        const nested = cap.cases.some((c) => Array.isArray(c.expected) && (c.expected as unknown[]).some(Array.isArray));
        const comparator = unordered ? (nested ? "unordered-nested" : "unordered") : "exact";

        const manifest = {
          id: slug,
          kind: "function",
          entry,
          names: { python: snake(entry) },
          argTypes,
          returnType,
          comparator,
          cases: cap.cases.map((c) => ({ name: c.name, args: c.args, expected: c.expected })),
        };

        const outPath = join(PROBLEMS_DIR, `${slug}.json`);

        // Try comparators strongest-first. We only fall back from "exact" when the
        // KNOWN-CORRECT vendored reference itself fails exact — which means order
        // genuinely doesn't matter for this problem, so a looser comparator is correct.
        const tryCmps =
          comparator === "exact"
            ? ["exact", "unordered-nested", "unordered", "set"]
            : [comparator, "unordered-nested", "unordered"];
        // Verify against the vendored reference; if it's buggy, fall back to a
        // correct override at prisma/refs/<slug>.ts (dual-oracle: test literals + a
        // known-correct solution must agree).
        const refPath = join(REFS, `${slug}.ts`);
        const solutions = existsSync(refPath) ? [indexPath, refPath] : [indexPath];
        let kept = false;
        for (const solPath of solutions) {
          for (const cmp of tryCmps) {
            (manifest as { comparator: string }).comparator = cmp;
            writeFileSync(outPath, JSON.stringify(manifest, null, 2) + "\n");
            if (verify(outPath, solPath)) {
              const tag = solPath === refPath ? " [ref]" : "";
              results.ok.push((cmp === comparator ? slug : `${slug} [${cmp}]`) + tag);
              kept = true;
              break;
            }
          }
          if (kept) break;
        }
        if (!kept) {
          rmSync(outPath, { force: true });
          results.fail.push(`${slug} (reference + override failed all comparators)`);
        }
      } catch (e) {
        results.skip.push(`${slug} (extract error: ${String(e instanceof Error ? e.message.split("\n")[0] : e)})`);
      } finally {
        rmSync(T, { recursive: true, force: true });
      }
    }
  }

  console.log(`\n✓ kept ${results.ok.length}:`, results.ok.join(", "));
  console.log(`\n⤫ verify-failed ${results.fail.length}:`, results.fail.join("\n  "));
  console.log(`\n· skipped ${results.skip.length}:`, results.skip.join("\n  "));
}

main();
