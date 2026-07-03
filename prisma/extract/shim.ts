// Instrumentation shim used by the case extractor (prisma/extract-cases.ts).
// Replaces bun:test in a vendored test file and records the real (args, expected)
// pairs at runtime, serializing ListNode/TreeNode the same way the harness does.
// Self-contained: no imports.

import { writeFileSync } from "node:fs";

type Rec = { name: string; args: unknown[]; argTypes: string[]; resultType: string; resultKind: string };
type Case = {
  name: string;
  entry: string;
  args: unknown[];
  argTypes: string[];
  expected: unknown;
  returnType: string;
  unordered: boolean;
};

const records: Rec[] = []; // unconsumed solution calls (LIFO)
const cases: Case[] = [];
const entryNames = new Set<string>();
let currentIt = "case";
let leftover = 0;

// --- serialization (mirrors harnesses/typescript/serde.ts) ---
function typeOf(v: unknown): string {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    if ("next" in (v as object) && "val" in (v as object)) return "ListNode";
    if (("left" in (v as object) || "right" in (v as object)) && "val" in (v as object))
      return "TreeNode";
  }
  return "any";
}

function serialize(v: unknown): unknown {
  const t = typeOf(v);
  if (t === "ListNode") {
    const out: number[] = [];
    let cur = v as { val: number; next: unknown } | null;
    const seen = new Set<unknown>();
    while (cur && !seen.has(cur)) {
      seen.add(cur);
      out.push(cur.val);
      cur = cur.next as typeof cur;
    }
    return out;
  }
  if (t === "TreeNode") {
    const out: (number | null)[] = [];
    const q: unknown[] = [v];
    while (q.length) {
      const n = q.shift() as { val: number; left: unknown; right: unknown } | null;
      if (n) {
        out.push(n.val);
        q.push(n.left, n.right);
      } else out.push(null);
    }
    while (out.length && out[out.length - 1] === null) out.pop();
    return out;
  }
  if (Array.isArray(v)) return v.map(serialize);
  if (v && typeof v === "object") return JSON.parse(JSON.stringify(v));
  return v;
}

// Exported for generated wrapped.ts. Args must be serialized BEFORE the call
// (many solutions mutate their input in place), so the wrapper snapshots first.
export const __ser = serialize;
export const __type = typeOf;
export function __push(
  name: string,
  argsSer: unknown[],
  argTypes: string[],
  result: unknown,
) {
  const resultKind = typeof result === "object" ? "collection" : "scalar";
  records.push({ name, args: argsSer, argTypes, resultType: typeOf(result), resultKind });
}

// --- bun:test replacements (run callbacks synchronously) ---
export function describe(_name: string, fn: () => void) {
  fn();
}
export function it(name: string, fn: () => void) {
  currentIt = name;
  const before = records.length;
  fn();
  // Any solution calls not consumed by an expect in this `it` are leftovers
  // (setup calls / sequence steps) — used to detect sequence/design problems.
  leftover += records.length - Math.max(before, consumedFloor);
  consumedFloor = records.length;
}
export const test = it;
export function beforeEach(fn: () => void) { fn(); }
export function beforeAll(fn: () => void) { fn(); }
export function afterEach() {}
export function afterAll() {}

let consumedFloor = 0;

function record(expected: unknown, unordered: boolean) {
  const rec = records.pop(); // consume the solution call even if we skip recording
  consumedFloor = records.length;
  if (!rec) return;
  // Skip helper-style assertions like expect(sameElements(result, x)).toBe(true):
  // a scalar expected against a collection-returning solution is not the real answer.
  const et = typeof expected;
  const scalarExpected = et === "boolean" || et === "number" || et === "string";
  if (scalarExpected && rec.resultKind === "collection") return;
  entryNames.add(rec.name);
  cases.push({
    name: currentIt,
    entry: rec.name,
    args: rec.args,
    argTypes: rec.argTypes,
    expected: serialize(expected),
    returnType: rec.resultType,
    unordered,
  });
}

type Matchers = {
  toBe: (e: unknown) => void;
  toEqual: (e: unknown) => void;
  toStrictEqual: (e: unknown) => void;
  toContainEqual: (e: unknown) => void;
  not: Record<string, () => void>;
};

export function expect(_actual: unknown): Matchers {
  const unwrap = (e: unknown): { value: unknown; unordered: boolean } => {
    if (e && typeof e === "object" && "__arrayContaining" in (e as object)) {
      return { value: (e as { __arrayContaining: unknown }).__arrayContaining, unordered: true };
    }
    return { value: e, unordered: false };
  };
  return {
    toBe: (e) => { const u = unwrap(e); record(u.value, u.unordered); },
    toEqual: (e) => { const u = unwrap(e); record(u.value, u.unordered); },
    toStrictEqual: (e) => { const u = unwrap(e); record(u.value, u.unordered); },
    toContainEqual: (e) => record(e, true),
    not: { toBe: () => {}, toEqual: () => {} },
  };
}
expect.arrayContaining = (v: unknown) => ({ __arrayContaining: v });
expect.objectContaining = (v: unknown) => v;
expect.any = () => ({ __any: true });

export function __flush() {
  const out = process.env.EXTRACT_OUT || "out.json";
  writeFileSync(
    out,
    JSON.stringify({ cases, entryNames: [...entryNames], leftover }, null, 2),
  );
}
