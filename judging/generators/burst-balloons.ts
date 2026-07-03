import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random #${i}`, args: [rng.ints(rng.int(1, 8), 0, 100)] });
  }
  return out;
}

export function stress(rng: Rng) {
  // memo-less burst-order search is factorial; interval dp is n^3
  return [{ name: "n=150", args: [rng.ints(150, 0, 100)] }];
}

// try every burst order (cases keep n <= 8)
export function brute(nums: number[]): number {
  const go = (arr: number[]): number => {
    if (!arr.length) return 0;
    let best = 0;
    for (let i = 0; i < arr.length; i++) {
      const gain = (arr[i - 1] ?? 1) * arr[i] * (arr[i + 1] ?? 1);
      best = Math.max(best, gain + go([...arr.slice(0, i), ...arr.slice(i + 1)]));
    }
    return best;
  };
  return go(nums);
}
