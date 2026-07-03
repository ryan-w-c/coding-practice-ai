import type { Rng } from "./_rng";
import { sortedDistinct } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const n = rng.int(1, 300);
    const distinct = rng.shuffle(sortedDistinct(rng, n, -1000, 7));
    if (i % 2 === 0 && n > 1) {
      distinct[rng.int(0, n - 1)] = distinct[rng.int(0, n - 1)]; // may or may not dupe
    }
    out.push({ name: `random #${i} (n=${n})`, args: [distinct] });
  }
  out.push({ name: "single element", args: [[7]] });
  out.push({ name: "adjacent duplicate", args: [[1, 1]] });
  out.push({ name: "duplicate at both ends", args: [[5, 2, 3, 5]] });
  return out;
}

export function stress(rng: Rng) {
  const distinct = rng.shuffle(sortedDistinct(rng, 300_000, 1, 7));
  const withDupe = [...distinct];
  withDupe[rng.int(0, withDupe.length - 1)] = withDupe[rng.int(0, withDupe.length - 1)];
  return [
    { name: "n=300000 all distinct", args: [distinct] },
    { name: "n=300000 with a duplicate", args: [withDupe] },
  ];
}

export function brute(nums: number[]): boolean {
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++) if (nums[i] === nums[j]) return true;
  return false;
}
