import type { Rng } from "./_rng";
import { connectedGraph } from "./_shared";

function forest(rng: Rng, n: number, components: number): number[][] {
  // partition nodes into groups, build a connected graph per group
  const ids = rng.shuffle(Array.from({ length: n }, (_, i) => i));
  const edges: number[][] = [];
  let at = 0;
  for (let c = 0; c < components; c++) {
    const size = c === components - 1 ? n - at : Math.max(1, Math.floor((n - at) / (components - c)));
    const group = ids.slice(at, at + size);
    for (const [u, v] of connectedGraph(rng, group.length, rng.int(0, 2))) {
      edges.push([group[u], group[v]]);
    }
    at += size;
  }
  return rng.shuffle(edges);
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const n = rng.int(1, 100);
    const comps = rng.int(1, Math.min(8, n));
    out.push({ name: `random #${i} (n=${n}, ${comps} components)`, args: [n, forest(rng, n, comps)] });
  }
  out.push({ name: "no edges", args: [5, []] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=100000 in 50 components", args: [100_000, forest(rng, 100_000, 50)] }];
}

export function brute(n: number, edges: number[][]): number {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const seen = new Array<boolean>(n).fill(false);
  let count = 0;
  for (let s = 0; s < n; s++) {
    if (seen[s]) continue;
    count++;
    const stack = [s];
    seen[s] = true;
    while (stack.length) {
      const u = stack.pop()!;
      for (const v of adj[u]) if (!seen[v]) { seen[v] = true; stack.push(v); }
    }
  }
  return count;
}
