import type { Rng } from "./_rng";
import { intervals } from "./_shared";

// non-overlapping sorted intervals as the base
function base(rng: Rng, n: number): number[][] {
  const out: number[][] = [];
  let at = rng.int(0, 5);
  for (let i = 0; i < n; i++) {
    const start = at + rng.int(1, 10);
    const end = start + rng.int(0, 8);
    out.push([start, end]);
    at = end;
  }
  return out;
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const b = base(rng, rng.int(0, 30));
    const hi = b.length ? b[b.length - 1][1] + 10 : 20;
    const s = rng.int(0, hi);
    out.push({ name: `random #${i}`, args: [b, [s, s + rng.int(0, 15)]] });
  }
  return out;
}

export function stress(rng: Rng) {
  const b = base(rng, 100_000);
  const mid = b[50_000];
  return [{ name: "n=100000 insert overlapping middle", args: [b, [mid[0] - 5, mid[1] + 40]] }];
}

// concat, sort, merge
export function brute(ivs: number[][], newInterval: number[]): number[][] {
  const all = [...ivs, newInterval].sort((a, b) => a[0] - b[0]);
  const out: number[][] = [];
  for (const [s, e] of all) {
    if (out.length && s <= out[out.length - 1][1]) {
      out[out.length - 1][1] = Math.max(out[out.length - 1][1], e);
    } else out.push([s, e]);
  }
  return out;
}
