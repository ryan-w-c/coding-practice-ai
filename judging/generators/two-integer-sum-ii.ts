import type { Rng } from "./_rng";

// LeetCode 167 guarantees exactly one solution, so generated inputs must have
// exactly one pair summing to target (otherwise several answers are valid).

function countPairs(a: number[], target: number): number {
  let c = 0;
  for (let i = 0; i < a.length; i++)
    for (let j = i + 1; j < a.length; j++) if (a[i] + a[j] === target) c++;
  return c;
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  let made = 0, guard = 0;
  while (made < 10 && guard++ < 2000) {
    const n = rng.int(2, 150);
    const a = rng.ints(n, -1000, 1000).sort((x, y) => x - y);
    const i = rng.int(0, n - 2);
    const j = rng.int(i + 1, n - 1);
    const target = a[i] + a[j];
    if (countPairs(a, target) !== 1) continue; // ambiguous — retry
    out.push({ name: `random unique-pair #${made} (n=${n})`, args: [a, target] });
    made++;
  }
  out.push({ name: "two elements", args: [[-3, 9], 6] });
  out.push({ name: "answer at both ends", args: [[-1000, -2, 0, 5, 7, 1000], 0] });
  return out;
}

export function stress(rng: Rng) {
  // Distinct ascending values with target = a[n-2] + a[n-1] (the maximum
  // possible sum): provably unique, and an O(n^2) scan over (i, j) pairs has
  // to walk all ~4.5e10 pairs before finding it at the very end.
  const n = 300_000;
  const a: number[] = [];
  let v = rng.int(1, 100);
  for (let i = 0; i < n; i++) {
    v += rng.int(1, 9);
    a.push(v);
  }
  return [{ name: "n=300000 unique pair is the two largest", args: [a, a[n - 2] + a[n - 1]] }];
}

// O(n^2) scan (1-indexed result).
export function brute(numbers: number[], target: number): number[] {
  for (let i = 0; i < numbers.length; i++)
    for (let j = i + 1; j < numbers.length; j++)
      if (numbers[i] + numbers[j] === target) return [i + 1, j + 1];
  return [];
}
