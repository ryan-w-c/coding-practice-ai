import type { Rng } from "./_rng";

function rotatedDistinct(rng: Rng, n: number): number[] {
  const a: number[] = [];
  let v = rng.int(-10_000, 0);
  for (let i = 0; i < n; i++) {
    v += rng.int(1, 20);
    a.push(v);
  }
  const r = rng.int(0, n - 1);
  return [...a.slice(r), ...a.slice(0, r)];
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const n = rng.int(1, 200);
    const a = rotatedDistinct(rng, n);
    const present = rng.next() < 0.5;
    const target = present ? a[rng.int(0, n - 1)] : Math.max(...a) + 1;
    out.push({ name: `random #${i} (n=${n}, ${present ? "present" : "absent"})`, args: [a, target] });
  }
  out.push({ name: "not rotated, target at start", args: [[1, 3, 5, 7], 1] });
  out.push({ name: "rotated, target is pivot min", args: [[6, 7, 1, 2, 3], 1] });
  out.push({ name: "single element miss", args: [[3], 5] });
  out.push({ name: "two elements, target second", args: [[3, 1], 1] });
  return out;
}

export function stress(rng: Rng) {
  const a = rotatedDistinct(rng, 100_000);
  return [
    { name: "n=100000 present", args: [a, a[rng.int(0, a.length - 1)]] },
    { name: "n=100000 absent", args: [a, Math.max(...a) + 1] },
  ];
}

export function brute(nums: number[], target: number): number {
  return nums.indexOf(target);
}
