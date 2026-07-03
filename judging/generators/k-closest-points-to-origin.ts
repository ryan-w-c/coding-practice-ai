import type { Rng } from "./_rng";
import { sortedDistinct } from "./_shared";

// points with pairwise-distinct distances so the k closest are unique
function distinctDistancePoints(rng: Rng, n: number): number[][] {
  const points: number[][] = [];
  const seen = new Set<number>();
  let guard = 0;
  while (points.length < n && guard++ < n * 50) {
    const x = rng.int(-1000, 1000), y = rng.int(-1000, 1000);
    const d = x * x + y * y;
    if (seen.has(d)) continue;
    seen.add(d);
    points.push([x, y]);
  }
  return points;
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const pts = distinctDistancePoints(rng, rng.int(1, 120));
    out.push({ name: `random #${i} (n=${pts.length})`, args: [pts, rng.int(1, pts.length)] });
  }
  return out;
}

export function stress(rng: Rng) {
  const pts = distinctDistancePoints(rng, 60_000);
  return [{ name: `n=${pts.length} k=1000`, args: [pts, 1000] }];
}

export function brute(points: number[][], k: number): number[][] {
  return [...points]
    .sort((a, b) => a[0] * a[0] + a[1] * a[1] - (b[0] * b[0] + b[1] * b[1]))
    .slice(0, k);
}
