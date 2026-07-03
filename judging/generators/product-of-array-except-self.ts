import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const n = rng.int(2, 30);
    // small values keep |product| well inside float precision
    const nums = Array.from({ length: n }, () => rng.pick([-2, -1, -1, 0, 1, 1, 2]));
    out.push({ name: `random small values #${i} (n=${n})`, args: [nums] });
  }
  out.push({ name: "two zeros", args: [[0, 3, 0, 4]] });
  out.push({ name: "single zero", args: [[2, 0, 5]] });
  out.push({ name: "all negative", args: [[-1, -2, -1, -3]] });
  return out;
}

export function stress(rng: Rng) {
  const nums = Array.from({ length: 300_000 }, () => rng.pick([-1, 1, 1, -1]));
  nums[rng.int(0, nums.length - 1)] = 0;
  return [{ name: "n=300000 signs with one zero", args: [nums] }];
}

export function brute(nums: number[]): number[] {
  return nums.map((_, i) => nums.reduce((p, v, j) => (j === i ? p : p * v), 1));
}
