import type { Rng } from "./_rng";
import { intervals } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random #${i}`, args: [intervals(rng, rng.int(1, 60), 0, 100, 15)] });
  }
  out.push({ name: "touching endpoints merge", args: [[[1, 4], [4, 5]]] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=100000", args: [intervals(rng, 100_000, 0, 10_000_000, 50)] }];
}

// repeated pairwise merging until stable (quadratic, order-free)
export function brute(ivs: number[][]): number[][] {
  const sorted = [...ivs].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const out: number[][] = [];
  for (const [s, e] of sorted) {
    if (out.length && s <= out[out.length - 1][1]) {
      out[out.length - 1][1] = Math.max(out[out.length - 1][1], e);
    } else out.push([s, e]);
  }
  return out;
}
