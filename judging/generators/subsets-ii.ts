import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 8; i++) {
    const n = rng.int(0, 10);
    out.push({ name: `random with dupes #${i} (n=${n})`, args: [rng.ints(n, -3, 3)] });
  }
  out.push({ name: "all identical", args: [[5, 5, 5, 5]] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=14 heavy duplicates", args: [rng.ints(14, -2, 2)] }];
}

// bitmask enumeration + dedupe on sorted-subset key
export function brute(nums: number[]): number[][] {
  const seen = new Set<string>();
  const out: number[][] = [];
  for (let mask = 0; mask < 1 << nums.length; mask++) {
    const sub: number[] = [];
    for (let i = 0; i < nums.length; i++) if (mask & (1 << i)) sub.push(nums[i]);
    sub.sort((a, b) => a - b);
    const key = sub.join(",");
    if (!seen.has(key)) {
      seen.add(key);
      out.push(sub);
    }
  }
  return out;
}
