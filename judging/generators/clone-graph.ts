import type { Rng } from "./_rng";
import { connectedGraph } from "./_shared";

// adjacency in clone-graph form: adj[i] = neighbor vals of node i+1
function adjacency(rng: Rng, n: number): number[][] {
  if (n === 0) return [];
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of connectedGraph(rng, n, rng.int(0, n))) {
    adj[u].push(v + 1);
    adj[v].push(u + 1);
  }
  return adj;
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    out.push({ name: `random connected #${i}`, args: [adjacency(rng, rng.int(1, 60))] });
  }
  out.push({ name: "single node", args: [[[]]] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=5000 nodes", args: [adjacency(rng, 5000)] }];
}

// a correct deep clone serializes back to the same adjacency (neighbor lists sorted)
export function brute(adj: number[][]): number[][] {
  return adj.map((ns) => [...ns].sort((a, b) => a - b));
}
