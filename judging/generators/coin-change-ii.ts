import type { Rng } from "./_rng";
import { sortedDistinct } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const coins = rng.shuffle(sortedDistinct(rng, rng.int(1, 5), 1, 6));
    out.push({ name: `random #${i}`, args: [rng.int(0, 60), coins] });
  }
  out.push({ name: "amount zero one way", args: [0, [3, 7]] });
  return out;
}

export function stress(_rng: Rng) {
  // large amount, few big coins keeps the count well under 2^31
  return [{ name: "amount=2000 coins 7/11/13", args: [2000, [7, 11, 13]] }];
}

// exhaustive combination count (non-decreasing pick order)
export function brute(amount: number, coins: number[]): number {
  const cs = [...coins].sort((a, b) => a - b);
  const go = (rem: number, start: number): number => {
    if (rem === 0) return 1;
    let count = 0;
    for (let i = start; i < cs.length && cs[i] <= rem; i++) count += go(rem - cs[i], i);
    return count;
  };
  return go(amount, 0);
}
