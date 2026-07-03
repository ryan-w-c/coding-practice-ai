import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 8; i++) {
    const n = rng.int(1, 200);
    out.push({ name: `random #${i} (n=${n})`, args: [rng.ints(n, 0, 1000)] });
  }
  out.push({ name: "strictly decreasing (no profit)", args: [rng.ints(50, 0, 1000).sort((a, b) => b - a)] });
  out.push({ name: "strictly increasing", args: [rng.ints(50, 0, 1000).sort((a, b) => a - b)] });
  out.push({ name: "single day", args: [[500]] });
  out.push({ name: "best buy after early spike", args: [[900, 1, 2, 3, 800]] });
  return out;
}

export function stress(rng: Rng) {
  // 300k: O(n^2) ≈ 4.5e10 iterations TLEs even under Bun's JIT; O(n) is instant.
  return [{ name: "n=300000 random prices", args: [rng.ints(300_000, 0, 10_000)] }];
}

// O(n^2) — try every buy/sell pair.
export function brute(prices: number[]): number {
  let best = 0;
  for (let i = 0; i < prices.length; i++)
    for (let j = i + 1; j < prices.length; j++) best = Math.max(best, prices[j] - prices[i]);
  return best;
}
