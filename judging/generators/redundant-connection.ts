import type { Rng } from "./_rng";
import { connectedGraph } from "./_shared";

// tree (1-indexed) + one extra edge somewhere in the list
function input(rng: Rng, n: number): number[][] {
  const tree = connectedGraph(rng, n, 0).map(([u, v]) => [u + 1, v + 1]);
  let a = rng.int(1, n), b = rng.int(1, n);
  while (a === b) b = rng.int(1, n);
  const at = rng.int(0, tree.length);
  tree.splice(at, 0, [Math.min(a, b), Math.max(a, b)]);
  return tree;
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random #${i}`, args: [input(rng, rng.int(3, 80))] });
  }
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=50000", args: [input(rng, 50_000)] }];
}

// scan edges in order with a DSU; the first edge joining an already-connected pair is the answer
export function brute(edges: number[][]): number[] {
  const n = edges.length;
  const parent = Array.from({ length: n + 2 }, (_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  for (const [u, v] of edges) {
    const ru = find(u), rv = find(v);
    if (ru === rv) return [u, v];
    parent[ru] = rv;
  }
  return [];
}
