import type { Rng } from "./_rng";

function times(rng: Rng, n: number, count: number): number[][] {
  const seen = new Set<string>();
  const out: number[][] = [];
  let guard = 0;
  while (out.length < count && guard++ < count * 30) {
    const u = rng.int(1, n), v = rng.int(1, n);
    if (u === v || seen.has(`${u},${v}`)) continue;
    seen.add(`${u},${v}`);
    out.push([u, v, rng.int(1, 100)]);
  }
  return out;
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const n = rng.int(1, 40);
    out.push({ name: `random #${i} (n=${n})`, args: [times(rng, n, rng.int(1, n * 3)), n, rng.int(1, n)] });
  }
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=800 dense", args: [times(rng, 800, 6000), 800, 1] }];
}

// Bellman-Ford (independent of the ref's Dijkstra)
export function brute(ts: number[][], n: number, k: number): number {
  const dist = new Array<number>(n + 1).fill(Infinity);
  dist[k] = 0;
  for (let round = 0; round < n - 1; round++) {
    let changed = false;
    for (const [u, v, w] of ts) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        changed = true;
      }
    }
    if (!changed) break;
  }
  let out = 0;
  for (let i = 1; i <= n; i++) out = Math.max(out, dist[i]);
  return out === Infinity ? -1 : out;
}
