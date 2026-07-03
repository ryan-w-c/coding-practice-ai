import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const nums = rng.ints(rng.int(1, 18), 1, 50);
    out.push({ name: `random #${i}`, args: [nums] });
  }
  out.push({ name: "even sum but impossible", args: [[2, 2, 3, 5]] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=200 values<=100", args: [rng.ints(200, 1, 100)] }];
}

// bitmask exhaustive
export function brute(nums: number[]): boolean {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2) return false;
  const target = total / 2;
  const reach = new Set<number>([0]);
  for (const n of nums) {
    for (const s of [...reach]) if (s + n <= target) reach.add(s + n);
  }
  return reach.has(target);
}
