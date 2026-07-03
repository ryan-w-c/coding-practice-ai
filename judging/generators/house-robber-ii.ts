import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    out.push({ name: `random circular #${i}`, args: [rng.ints(rng.int(1, 18), 0, 400)] });
  }
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=100000", args: [rng.ints(100_000, 0, 400)] }];
}

export function brute(nums: number[]): number {
  if (nums.length === 1) return nums[0];
  const linear = (arr: number[]): number => {
    const go = (i: number): number =>
      i >= arr.length ? 0 : Math.max(go(i + 1), arr[i] + go(i + 2));
    return go(0);
  };
  return Math.max(linear(nums.slice(1)), linear(nums.slice(0, -1)));
}
