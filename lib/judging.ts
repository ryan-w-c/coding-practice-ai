// Server-side helpers for harness-based multi-language judging
// (docs/multi-language-judging.md). Reads the neutral case files under judging/.

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

// Languages we ship a harness for (harnesses/<lang>/).
export const HARNESS_LANGUAGES = ["typescript", "python", "java"] as const;
export type HarnessLanguage = (typeof HARNESS_LANGUAGES)[number];

export type Manifest = {
  id: string;
  kind: "function" | "sequence" | "roundtrip";
  entry?: string;
  class?: string;
  names?: Record<string, string>;
  argTypes?: string[];
  returnType?: string;
  comparator: string;
  // roundtrip: judge decode(encode(data)) == data on a fresh `class` instance
  encode?: string;
  decode?: string;
  dataType?: string;
  // void/in-place problems: judge this arg (post-call) instead of the return value
  resultFrom?: number;
  // deep-copy problems: fail if the result shares nodes with this input arg
  mustCopy?: number;
  cases: unknown[];
};

/** Machine-generated cases (random + stress) are hidden from the sample list. */
export function isHiddenCase(name: string): boolean {
  return name.startsWith("gen: ") || name.startsWith("stress: ");
}

/** Compact JSON preview capped for UI transport; big stress payloads stay server-side. */
export function jsonPreview(v: unknown, max = 1200): string {
  const s = JSON.stringify(v);
  if (s === undefined) return "";
  return s.length > max ? `${s.slice(0, max)} … (${s.length.toLocaleString()} chars total)` : s;
}

export function loadManifest(problemId: string): Manifest | null {
  const p = join(process.cwd(), "judging", "problems", `${problemId}.json`);
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, "utf8")) as Manifest;
  } catch {
    return null;
  }
}

/** Languages the problem can be judged in, given whether the legacy TS suite passed. */
export function judgeableLanguages(
  problemId: string,
  legacyTsJudged: boolean,
): string[] {
  if (loadManifest(problemId)) return [...HARNESS_LANGUAGES];
  return legacyTsJudged ? ["typescript"] : [];
}

// --- per-language starter generation from a manifest ---

const PY_PARAM_BY_TYPE: Record<string, string> = {
  int: "n",
  long: "n",
  float: "x",
  bool: "flag",
  string: "s",
  char: "c",
  "int[]": "nums",
  "int[][]": "grid",
  "string[]": "strs",
  "string[][]": "board",
  "char[][]": "grid",
  ListNode: "head",
  ListNodeCycle: "head",
  ListNodeRandom: "head",
  "ListNode[]": "lists",
  TreeNode: "root",
  Graph: "graph",
  GraphNode: "node",
};

function pyParams(argTypes: string[]): string[] {
  const used: Record<string, number> = {};
  return argTypes.map((t, i) => {
    const base = PY_PARAM_BY_TYPE[t] ?? `arg${i}`;
    used[base] = (used[base] ?? 0) + 1;
    return used[base] > 1 ? `${base}${used[base]}` : base;
  });
}

function pyNodeHint(types: string[]): string {
  const hints: string[] = [];
  if (types.some((t) => t.startsWith("ListNode"))) hints.push("ListNode has .val/.next");
  if (types.includes("TreeNode")) hints.push("TreeNode has .val/.left/.right");
  if (types.includes("ListNodeRandom")) hints.push("Node has .val/.next/.random");
  if (types.includes("GraphNode")) hints.push("Node has .val/.neighbors");
  return hints.length ? `# ${hints.join("; ")} (provided at runtime).\n` : "";
}

export function pythonStarter(m: Manifest): string {
  const nodeHint = pyNodeHint(m.argTypes ?? []);

  if (m.kind === "roundtrip") {
    const cls = m.names?.python ?? m.class ?? "Codec";
    const dataParam = PY_PARAM_BY_TYPE[m.dataType ?? ""] ?? "data";
    return (
      pyNodeHint([m.dataType ?? ""]) +
      `class ${cls}:\n` +
      `    def ${m.encode}(self, ${dataParam}):\n        # TODO: implement (returns a string)\n        pass\n\n` +
      `    def ${m.decode}(self, data):\n        # TODO: implement (returns the original ${m.dataType})\n        pass\n`
    );
  }

  if (m.kind === "sequence") {
    const cls = m.class ?? "Solution";
    // Derive method signatures from the first case's steps.
    const steps =
      (m.cases[0] as { steps?: { method: string; args: unknown[] }[] })?.steps ?? [];
    const seen = new Set<string>();
    const lines = [`class ${cls}:`];
    for (const st of steps) {
      if (seen.has(st.method)) continue;
      seen.add(st.method);
      const params = st.args.map((_, i) => `a${i}`);
      if (st.method === "constructor") {
        lines.push(
          `    def __init__(self${params.length ? ", " + params.join(", ") : ""}):`,
          "        # TODO: implement",
          "        pass",
        );
      } else {
        lines.push(
          `    def ${st.method}(self${params.length ? ", " + params.join(", ") : ""}):`,
          "        # TODO: implement",
          "        pass",
        );
      }
    }
    return lines.join("\n") + "\n";
  }

  const name = m.names?.python ?? m.entry ?? "solve";
  const params = pyParams(m.argTypes ?? []);
  const todo =
    m.resultFrom !== undefined
      ? `# TODO: implement (modify ${params[m.resultFrom] ?? "the input"} in place; no return value)`
      : `# TODO: implement (returns ${m.returnType ?? "value"})`;
  return nodeHint + `def ${name}(${params.join(", ")}):\n    ${todo}\n    pass\n`;
}

// --- TypeScript starter generation from a manifest ---

const TS_DECLS: Record<string, string> = {
  ListNode: "type ListNode = { val: number; next: ListNode | null };",
  TreeNode: "type TreeNode = { val: number; left: TreeNode | null; right: TreeNode | null };",
  RandomNode: "type Node = { val: number; next: Node | null; random: Node | null };",
  GraphNode: "type Node = { val: number; neighbors: Node[] };",
};

function tsSampleType(v: unknown): string {
  if (typeof v === "boolean") return "boolean";
  if (typeof v === "number") return "number";
  if (typeof v === "string") return "string";
  if (Array.isArray(v)) {
    const e = v.find((x) => x !== null && x !== undefined);
    return e === undefined ? "number[]" : `${tsSampleType(e)}[]`;
  }
  return "any";
}

function tsType(sample: unknown, declared?: string): string {
  switch (declared) {
    case "int": case "long": case "float": return "number";
    case "bool": return "boolean";
    case "string": case "char": return "string";
    case "int[]": return "number[]";
    case "int[][]": return "number[][]";
    case "string[]": return "string[]";
    case "string[][]": case "char[][]": return "string[][]";
    case "ListNode": case "ListNodeCycle": return "ListNode | null";
    case "TreeNode": return "TreeNode | null";
    case "ListNodeRandom": case "GraphNode": return "Node | null";
    case "ListNode[]": return "(ListNode | null)[]";
    default: return tsSampleType(sample);
  }
}

const TS_NAME_BY_TYPE: Record<string, string> = {
  number: "n", string: "s", boolean: "flag",
  "number[]": "nums", "string[]": "strs", "number[][]": "grid", "string[][]": "board",
  "ListNode | null": "head", "TreeNode | null": "root", "Node | null": "node",
  "(ListNode | null)[]": "lists",
};

function tsDeclsFor(argTypes: string[], returnType?: string): string {
  const all = [...argTypes, returnType ?? ""];
  const decls: string[] = [];
  if (all.some((t) => t === "ListNode" || t === "ListNodeCycle" || t === "ListNode[]"))
    decls.push(TS_DECLS.ListNode);
  if (all.includes("TreeNode")) decls.push(TS_DECLS.TreeNode);
  if (all.includes("ListNodeRandom")) decls.push(TS_DECLS.RandomNode);
  if (all.includes("GraphNode")) decls.push(TS_DECLS.GraphNode);
  return decls.length ? decls.join("\n") + "\n\n" : "";
}

function tsDefault(type: string): string {
  if (type === "number") return "0";
  if (type === "boolean") return "false";
  if (type === "string") return '""';
  if (type.endsWith("[]")) return "[]";
  return "null"; // node types / any
}

export function tsStarter(m: Manifest): string {
  if (m.kind === "roundtrip") {
    const dataTs = tsType(undefined, m.dataType);
    const dataParam = TS_NAME_BY_TYPE[dataTs] ?? "data";
    return (
      tsDeclsFor([m.dataType ?? ""]) +
      `export class ${m.class ?? "Codec"} {\n` +
      `  ${m.encode}(${dataParam}: ${dataTs}): string {\n    // TODO: implement\n    return "";\n  }\n\n` +
      `  ${m.decode}(data: string): ${dataTs} {\n    // TODO: implement\n    return ${tsDefault(dataTs)};\n  }\n}\n`
    );
  }

  if (m.kind === "sequence") {
    const cls = m.class ?? "Solution";
    const steps =
      (m.cases[0] as { steps?: { method: string; args: unknown[]; expected: unknown }[] })
        ?.steps ?? [];
    const allSteps = m.cases.flatMap(
      (c) => (c as { steps?: typeof steps }).steps ?? [],
    );
    const seen = new Set<string>();
    const members: string[] = [];
    for (const st of steps) {
      if (seen.has(st.method)) continue;
      seen.add(st.method);
      const params = st.args
        .map((v, i) => `a${i}: ${tsSampleType(v)}`)
        .join(", ");
      if (st.method === "constructor") {
        if (st.args.length) members.push(`  constructor(${params}) {\n    // TODO: implement\n  }`);
        continue;
      }
      const withExpected = allSteps.find(
        (s) => s.method === st.method && s.expected !== null && s.expected !== undefined,
      );
      const ret = withExpected ? tsSampleType(withExpected.expected) : "void";
      members.push(
        `  ${st.method}(${params}): ${ret} {\n    // TODO: implement\n` +
          (ret === "void" ? "" : `    return ${tsDefault(ret)};\n`) +
          "  }",
      );
    }
    return `export class ${cls} {\n${members.join("\n\n")}\n}\n`;
  }

  const c0 = m.cases[0] as { args?: unknown[]; expected?: unknown } | undefined;
  const argTypes = m.argTypes ?? [];
  const paramTypes = (c0?.args ?? []).map((v, i) => tsType(v, argTypes[i]));
  const used: Record<string, number> = {};
  const params = paramTypes.map((t, i) => {
    const base = TS_NAME_BY_TYPE[t] ?? `arg${i}`;
    used[base] = (used[base] ?? 0) + 1;
    return `${used[base] > 1 ? `${base}${used[base]}` : base}: ${t}`;
  });
  const ret = m.resultFrom !== undefined ? "void" : tsType(c0?.expected, m.returnType);
  return (
    tsDeclsFor(argTypes, m.returnType) +
    `export function ${m.entry}(${params.join(", ")}): ${ret} {\n  // TODO: implement\n` +
    (ret === "void" ? "" : `  return ${tsDefault(ret)};\n`) +
    "}\n"
  );
}

// --- Java starter generation (types inferred from sample data + argTypes) ---

function jType(v: unknown): string {
  if (v === null || v === undefined) return "int";
  if (typeof v === "boolean") return "boolean";
  if (typeof v === "number") return Number.isInteger(v) ? "int" : "double";
  if (typeof v === "string") return "String";
  if (Array.isArray(v)) {
    const e = v.find((x) => x !== null && x !== undefined);
    if (e === undefined) return "int[]";
    if (typeof e === "boolean") return "boolean[]";
    if (typeof e === "number") return Number.isInteger(e) ? "int[]" : "double[]";
    if (typeof e === "string") return "String[]";
    if (Array.isArray(e)) {
      const ee = (e as unknown[]).find((x) => x !== null && x !== undefined);
      return typeof ee === "string" ? "String[][]" : "int[][]";
    }
  }
  return "Object";
}

function javaType(sample: unknown, argType?: string): string {
  if (argType === "ListNode" || argType === "ListNodeCycle") return "ListNode";
  if (argType === "TreeNode") return "TreeNode";
  if (argType === "ListNodeRandom" || argType === "GraphNode") return "Node";
  if (argType === "ListNode[]") return "ListNode[]";
  if (argType === "char[][]") return "char[][]";
  if (argType === "string[][]") {
    // single-char cells (e.g. surrounded-regions) follow the LeetCode char[][] convention
    const allSingleChar =
      Array.isArray(sample) &&
      (sample as unknown[][]).every(
        (row) => Array.isArray(row) && row.every((c) => typeof c === "string" && c.length === 1),
      );
    return allSingleChar ? "char[][]" : "String[][]";
  }
  return jType(sample);
}

const JAVA_NAME_BY_TYPE: Record<string, string> = {
  int: "n", long: "n", double: "x", boolean: "flag", String: "s",
  "int[]": "nums", "double[]": "nums", "String[]": "strs", "boolean[]": "flags",
  "int[][]": "grid", "String[][]": "board", "char[][]": "board",
  ListNode: "head", TreeNode: "root", Node: "node", "ListNode[]": "lists",
};

function javaParams(types: string[]): string[] {
  const used: Record<string, number> = {};
  return types.map((t, i) => {
    const base = JAVA_NAME_BY_TYPE[t] ?? `a${i}`;
    used[base] = (used[base] ?? 0) + 1;
    const nm = used[base] > 1 ? `${base}${used[base]}` : base;
    return `${t} ${nm}`;
  });
}

function javaDefault(type: string): string {
  if (["int", "long", "double", "float", "short", "byte"].includes(type)) return "0";
  if (type === "boolean") return "false";
  if (type === "char") return "' '";
  return "null"; // String, arrays, ListNode, TreeNode, Object, List
}

export function javaStarter(m: Manifest): string {
  if (m.kind === "roundtrip") {
    const cls = m.class ?? "Codec";
    const dataJ = javaType(undefined, m.dataType);
    const dataParam =
      m.dataType === "string[]" ? "List<String> strs" : `${dataJ} ${JAVA_NAME_BY_TYPE[dataJ] ?? "data"}`;
    const decodeRet = m.dataType === "string[]" ? "List<String>" : dataJ;
    const decodeDefault = m.dataType === "string[]" ? "new ArrayList<>()" : javaDefault(decodeRet);
    return (
      "import java.util.*;\n\n" +
      `class ${cls} {\n` +
      `    public String ${m.encode}(${dataParam}) {\n        // TODO: implement\n        return "";\n    }\n\n` +
      `    public ${decodeRet} ${m.decode}(String data) {\n        // TODO: implement\n        return ${decodeDefault};\n    }\n}\n`
    );
  }

  if (m.kind === "sequence") {
    const cls = m.class ?? "Solution";
    const steps =
      (m.cases[0] as { steps?: { method: string; args: unknown[]; expected: unknown }[] })
        ?.steps ?? [];
    const allSteps = m.cases.flatMap(
      (c) => (c as { steps?: typeof steps }).steps ?? [],
    );
    const seen = new Set<string>();
    const lines = ["import java.util.*;", "", `class ${cls} {`];
    for (const st of steps) {
      if (seen.has(st.method)) continue;
      seen.add(st.method);
      const paramTypes = st.args.map((v) => jType(v));
      const params = javaParams(paramTypes).join(", ");
      if (st.method === "constructor") {
        lines.push(`    public ${cls}(${params}) {`, "        // TODO: implement", "    }");
      } else {
        const withExpected = allSteps.find(
          (s) => s.method === st.method && s.expected !== null && s.expected !== undefined,
        );
        const ret = withExpected ? jType(withExpected.expected) : "void";
        lines.push(
          `    public ${ret} ${st.method}(${params}) {`,
          "        // TODO: implement",
          ...(ret === "void" ? [] : [`        return ${javaDefault(ret)};`]),
          "    }",
        );
      }
    }
    lines.push("}");
    return lines.join("\n") + "\n";
  }

  const c0 = m.cases[0] as { args: unknown[]; expected: unknown };
  const argTypes = m.argTypes ?? [];
  const paramTypes = (c0?.args ?? []).map((v, i) => javaType(v, argTypes[i]));
  const params = javaParams(paramTypes).join(", ");
  const ret = m.resultFrom !== undefined ? "void" : javaType(c0?.expected, m.returnType);
  const hints: string[] = [];
  const used = [...paramTypes, ret];
  if (used.includes("ListNode")) hints.push("ListNode has .val/.next");
  if (used.includes("TreeNode")) hints.push("TreeNode has .val/.left/.right");
  if (argTypes.includes("ListNodeRandom")) hints.push("Node has .val/.next/.random");
  if (argTypes.includes("GraphNode")) hints.push("Node has .val/.neighbors");
  const nodeHint = hints.length ? `// ${hints.join("; ")} (provided).\n` : "";
  return (
    nodeHint +
    "import java.util.*;\n\n" +
    `class Solution {\n    public ${ret} ${m.entry}(${params}) {\n        // TODO: implement\n` +
    (ret === "void" ? "" : `        return ${javaDefault(ret)};\n`) +
    "    }\n}\n"
  );
}
