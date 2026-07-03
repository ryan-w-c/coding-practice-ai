import type { Rng } from "./_rng";

function sortedDistinct(rng: Rng, n: number, start: number, maxGap: number): number[] {
  const out: number[] = [];
  let v = start;
  for (let i = 0; i < n; i++) {
    v += rng.int(1, maxGap);
    out.push(v);
  }
  return out;
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const n = rng.int(1, 300);
    const a = sortedDistinct(rng, n, rng.int(-1000, 0), 7);
    const present = rng.next() < 0.5;
    // absent targets: outside the range, or in a gap between elements (distinct
    // values with gaps >= 1 mean value+... may still hit; brute decides truth)
    const target = present
      ? a[rng.int(0, n - 1)]
      : rng.pick([a[0] - 1, a[n - 1] + 1, a[rng.int(0, n - 1)] + 1]);
    out.push({ name: `random #${i} (n=${n}, ${present ? "present" : "maybe absent"})`, args: [a, target] });
  }
  out.push({ name: "single element hit", args: [[5], 5] });
  out.push({ name: "single element miss", args: [[5], -5] });
  out.push({ name: "target below range", args: [sortedDistinct(rng, 50, 0, 5), -100] });
  out.push({ name: "target above range", args: [sortedDistinct(rng, 50, 0, 5), 10_000] });
  return out;
}

export function stress(rng: Rng) {
  const a = sortedDistinct(rng, 100_000, 0, 5);
  return [
    { name: "n=100000 present", args: [a, a[rng.int(0, a.length - 1)]] },
    { name: "n=100000 absent", args: [a, a[a.length - 1] + 1] },
  ];
}

export function brute(nums: number[], target: number): number {
  return nums.indexOf(target);
}
