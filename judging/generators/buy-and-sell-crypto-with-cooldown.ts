import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random #${i}`, args: [rng.ints(rng.int(1, 16), 0, 1000)] });
  }
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=50000", args: [rng.ints(50_000, 0, 1000)] }];
}

// exhaustive: at each day either idle, buy (if flat), or sell (if holding; next day cools)
export function brute(prices: number[]): number {
  const go = (i: number, holding: boolean): number => {
    if (i >= prices.length) return 0;
    let best = go(i + 1, holding); // idle
    if (holding) best = Math.max(best, prices[i] + go(i + 2, false)); // sell + cooldown
    else best = Math.max(best, -prices[i] + go(i + 1, true)); // buy
    return best;
  };
  return go(0, false);
}
