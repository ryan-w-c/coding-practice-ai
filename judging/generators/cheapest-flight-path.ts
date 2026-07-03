import type { Rng } from "./_rng";

function flights(rng: Rng, n: number, count: number): number[][] {
  const seen = new Set<string>();
  const out: number[][] = [];
  let guard = 0;
  while (out.length < count && guard++ < count * 30) {
    const u = rng.int(0, n - 1), v = rng.int(0, n - 1);
    if (u === v || seen.has(`${u},${v}`)) continue;
    seen.add(`${u},${v}`);
    out.push([u, v, rng.int(1, 500)]);
  }
  return out;
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const n = rng.int(2, 10);
    const f = flights(rng, n, rng.int(1, Math.min(25, n * (n - 1))));
    let src = rng.int(0, n - 1), dst = rng.int(0, n - 1);
    while (dst === src) dst = rng.int(0, n - 1);
    out.push({ name: `random #${i} (n=${n}, k=${rng.int(0, 4)})`, args: [n, f, src, dst, rng.int(0, 4)] });
  }
  out.push({ name: "unreachable", args: [3, [[0, 1, 100]], 0, 2, 1] });
  out.push({ name: "k=0 direct only", args: [3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 0] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=100 dense k=10", args: [100, flights(rng, 100, 2500), 0, 99, 10] }];
}

// exhaustive DFS over all paths with <= k stops (cases keep n small)
export function brute(n: number, fl: number[][], src: number, dst: number, k: number): number {
  const adj: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v, w] of fl) adj[u].push([v, w]);
  let best = Infinity;
  const go = (u: number, cost: number, stopsLeft: number) => {
    if (cost >= best) return;
    if (u === dst) {
      best = cost;
      return;
    }
    if (stopsLeft < 0) return;
    for (const [v, w] of adj[u]) go(v, cost + w, stopsLeft - 1);
  };
  go(src, 0, k);
  return best === Infinity ? -1 : best;
}
