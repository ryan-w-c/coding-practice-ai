// TypeScript judging harness. Run: bun run harness.ts <case.json>
// Emits the LLJUDGE protocol (docs/multi-language-judging.md §4).
import { readFileSync } from "node:fs";
import { deserializeArg, serializeResult, sharesNodes } from "./serde";
import { compare } from "./comparators";

type FnCase = { name: string; args: unknown[]; expected: unknown };
type Step = { method: string; args: unknown[]; expected: unknown };
type SeqCase = { name: string; steps: Step[] };
type RtCase = { name: string; data: unknown };

type Manifest = {
  kind: "function" | "sequence" | "roundtrip";
  entry?: string;
  class?: string;
  argTypes?: string[];
  returnType?: string;
  comparator: string;
  // kind: "roundtrip" — judge decode(encode(data)) == data on a fresh `class` instance.
  encode?: string;
  decode?: string;
  dataType?: string;
  // Void/in-place problems: serialize this arg (post-call) instead of the return value.
  resultFrom?: number;
  // Deep-copy problems: fail if the result shares any node with this input arg.
  mustCopy?: number;
  cases: (FnCase | SeqCase | RtCase)[];
};

function emit(obj: unknown) {
  process.stdout.write("LLJUDGE " + JSON.stringify(obj) + "\n");
}

async function main() {
  const casePath = process.argv[2];
  const manifest = JSON.parse(readFileSync(casePath, "utf8")) as Manifest;
  const mod: Record<string, unknown> = await import(
    new URL("./solution.ts", import.meta.url).href
  );

  const resolveFn = (name: string): ((...a: unknown[]) => unknown) => {
    if (typeof mod[name] === "function") return mod[name] as (...a: unknown[]) => unknown;
    const Sol = mod["Solution"] as (new () => Record<string, unknown>) | undefined;
    if (Sol) {
      const inst = new Sol();
      const m = inst[name];
      if (typeof m === "function") return (m as (...a: unknown[]) => unknown).bind(inst);
    }
    throw new Error(`entry "${name}" not found (expected an export or a Solution method)`);
  };

  let passed = 0;
  const total = manifest.cases.length;

  manifest.cases.forEach((c, i) => {
    try {
      if (manifest.kind === "sequence") {
        const sc = c as SeqCase;
        const Cls = mod[manifest.class!] as (new (...a: unknown[]) => Record<string, unknown>) | undefined;
        if (!Cls) throw new Error(`class "${manifest.class}" not found`);
        let inst: Record<string, unknown> | null = null;
        for (const step of sc.steps) {
          if (step.method === "constructor") {
            inst = new Cls(...step.args);
            continue;
          }
          const fn = inst![step.method] as (...a: unknown[]) => unknown;
          const ret = fn.apply(inst, step.args);
          const got = ret === undefined ? null : ret;
          if (!compare("exact", got, step.expected)) {
            emit({ i, name: sc.name, status: "fail", got, want: step.expected, message: `step ${step.method}(${JSON.stringify(step.args)})` });
            return;
          }
        }
        passed++;
        emit({ i, name: sc.name, status: "pass" });
      } else if (manifest.kind === "roundtrip") {
        const rc = c as RtCase;
        const Cls = mod[manifest.class!] as (new () => Record<string, unknown>) | undefined;
        if (!Cls) throw new Error(`class "${manifest.class}" not found`);
        const inst = new Cls();
        const enc = (inst[manifest.encode!] as (a: unknown) => unknown).call(
          inst, deserializeArg(rc.data, manifest.dataType!));
        const dec = (inst[manifest.decode!] as (a: unknown) => unknown).call(inst, enc);
        const got = serializeResult(dec, manifest.dataType!);
        if (compare("exact", got, rc.data)) {
          passed++;
          emit({ i, name: rc.name, status: "pass" });
        } else {
          emit({ i, name: rc.name, status: "fail", got, want: rc.data, message: `${manifest.decode}(${manifest.encode}(data)) != data` });
        }
      } else {
        const fc = c as FnCase;
        const fn = resolveFn(manifest.entry!);
        const args = fc.args.map((v, k) => deserializeArg(v, manifest.argTypes?.[k] ?? "any"));
        const raw = fn(...args);
        if (manifest.mustCopy !== undefined && sharesNodes(args[manifest.mustCopy], raw)) {
          emit({ i, name: fc.name, status: "fail", got: "(result shares nodes with the input)", want: fc.expected, message: "must return a deep copy" });
          return;
        }
        const src = manifest.resultFrom !== undefined ? args[manifest.resultFrom] : raw;
        const got = serializeResult(src, manifest.returnType ?? "any");
        if (compare(manifest.comparator, got, fc.expected)) {
          passed++;
          emit({ i, name: fc.name, status: "pass", got });
        } else {
          emit({ i, name: fc.name, status: "fail", got, want: fc.expected });
        }
      }
    } catch (e) {
      emit({ i, name: (c as { name: string }).name, status: "error", message: String(e instanceof Error ? e.message : e) });
    }
  });

  process.stdout.write("LLJUDGE-SUMMARY " + JSON.stringify({ passed, total }) + "\n");
}

main().catch((e) => {
  process.stdout.write("LLJUDGE-ERROR " + String(e) + "\n");
  process.exit(1);
});
