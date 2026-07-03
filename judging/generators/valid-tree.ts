import type { Rng } from "./_rng";
import { connectedGraph } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const n = rng.int(1, 80);
    const kind = i % 3;
    let edges = connectedGraph(rng, n, 0); // spanning tree
    let label = "tree";
    if (kind === 1 && n >= 3) {
      // extra edge -> cycle
      let a = rng.int(0, n - 1), b = rng.int(0, n - 1);
      while (a === b) b = rng.int(0, n - 1);
      edges = rng.shuffle([...edges, [a, b]]);
      label = "cycle";
    } else if (kind === 2 && n >= 2 && edges.length) {
      edges = edges.slice(1); // drop an edge -> forest
      label = "forest";
    }
    out.push({ name: `${label} #${i} (n=${n})`, args: [n, edges] });
  }
  out.push({ name: "single node no edges", args: [1, []] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=100000 tree", args: [100_000, connectedGraph(rng, 100_000, 0)] }];
}

export function brute(n: number, edges: number[][]): boolean {
  if (edges.length !== n - 1) return false;
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const seen = new Set<number>([0]);
  const stack = [0];
  while (stack.length) {
    const u = stack.pop()!;
    for (const v of adj[u]) if (!seen.has(v)) { seen.add(v); stack.push(v); }
  }
  return seen.size === n;
}
