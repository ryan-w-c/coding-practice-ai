import type { Rng } from "./_rng";

// build inputs whose answer multiset is UNIQUE: distinct frequencies per value
function distinctFreqInput(rng: Rng, m: number, base: number): { nums: number[]; k: number } {
  const values = rng.shuffle(Array.from({ length: m }, (_, i) => base + i * rng.int(1, 3)));
  const nums: number[] = [];
  values.forEach((v, i) => {
    for (let c = 0; c <= i; c++) nums.push(v); // value i appears i+1 times
  });
  return { nums: rng.shuffle(nums), k: rng.int(1, m) };
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const { nums, k } = distinctFreqInput(rng, rng.int(1, 12), rng.int(-50, 50));
    out.push({ name: `random distinct-frequency #${i} (n=${nums.length}, k=${k})`, args: [nums, k] });
  }
  return out;
}

export function stress(rng: Rng) {
  const { nums } = distinctFreqInput(rng, 600, -300); // ~180k elements
  return [{ name: "n~180000 distinct frequencies k=250", args: [nums, 250] }];
}

export function brute(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, k).map(([v]) => v);
}
