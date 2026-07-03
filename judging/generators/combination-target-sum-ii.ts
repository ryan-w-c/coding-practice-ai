import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const nums = rng.ints(rng.int(1, 12), 1, 12);
    out.push({ name: `random #${i}`, args: [nums, rng.int(1, 30)] });
  }
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=16 heavy duplicates", args: [rng.ints(16, 1, 6), 20] }];
}

// bitmask enumeration + multiset dedupe
export function brute(candidates: number[], target: number): number[][] {
  const seen = new Set<string>();
  const out: number[][] = [];
  for (let mask = 0; mask < 1 << candidates.length; mask++) {
    const pick: number[] = [];
    let sum = 0;
    for (let i = 0; i < candidates.length; i++)
      if (mask & (1 << i)) {
        pick.push(candidates[i]);
        sum += candidates[i];
      }
    if (sum !== target) continue;
    pick.sort((a, b) => a - b);
    const key = pick.join(",");
    if (!seen.has(key)) {
      seen.add(key);
      out.push(pick);
    }
  }
  return out;
}
