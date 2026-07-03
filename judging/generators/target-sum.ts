import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const nums = rng.ints(rng.int(1, 16), 0, 20);
    const total = nums.reduce((a, b) => a + b, 0);
    out.push({ name: `random #${i}`, args: [nums, rng.int(-total, total)] });
  }
  out.push({ name: "zeros double ways", args: [[0, 0, 0, 1], 1] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=20 (LC max)", args: [rng.ints(20, 0, 100), 40] }];
}

// full 2^n enumeration
export function brute(nums: number[], target: number): number {
  let count = 0;
  const go = (i: number, sum: number) => {
    if (i === nums.length) {
      if (sum === target) count++;
      return;
    }
    go(i + 1, sum + nums[i]);
    go(i + 1, sum - nums[i]);
  };
  go(0, 0);
  return count;
}
