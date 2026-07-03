// Comparators (see docs/multi-language-judging.md §2). Inputs are already
// serialized to neutral JSON values by the harness.

function canon(x: unknown): string {
  return JSON.stringify(x);
}

function deepEqual(a: unknown, b: unknown): boolean {
  return canon(a) === canon(b);
}

function sortByCanon<T>(arr: T[]): T[] {
  return [...arr].sort((a, b) => (canon(a) < canon(b) ? -1 : canon(a) > canon(b) ? 1 : 0));
}

function floatEqual(a: unknown, b: unknown, tol = 1e-6): boolean {
  if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) <= tol;
  if (Array.isArray(a) && Array.isArray(b) && a.length === b.length) {
    return a.every((x, i) => floatEqual(x, b[i], tol));
  }
  return deepEqual(a, b);
}

export function compare(kind: string, got: unknown, want: unknown): boolean {
  switch (kind) {
    case "exact":
    case "linkedlist": // serialized to arrays already
    case "tree":
      return deepEqual(got, want);
    case "float":
      return floatEqual(got, want);
    case "unordered":
      if (!Array.isArray(got) || !Array.isArray(want)) return deepEqual(got, want);
      return deepEqual(sortByCanon(got), sortByCanon(want));
    case "unordered-nested":
      if (!Array.isArray(got) || !Array.isArray(want)) return deepEqual(got, want);
      return deepEqual(
        sortByCanon((got as unknown[][]).map((g) => sortByCanon(g))),
        sortByCanon((want as unknown[][]).map((g) => sortByCanon(g))),
      );
    case "set": {
      if (!Array.isArray(got) || !Array.isArray(want)) return deepEqual(got, want);
      const u = (a: unknown[]) => sortByCanon([...new Set(a.map(canon))].map((s) => JSON.parse(s)));
      return deepEqual(u(got), u(want));
    }
    default:
      if (kind.startsWith("validator:")) {
        throw new Error(`validator comparators not implemented: ${kind}`);
      }
      return deepEqual(got, want);
  }
}
