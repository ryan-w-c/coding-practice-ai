import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const runs = rng.int(1, 6);
    const vals: number[] = [];
    for (let r = 0; r < runs; r++) {
      const start = rng.int(-500, 500);
      const len = rng.int(1, 30);
      for (let k = 0; k < len; k++) vals.push(start + k);
    }
    // duplicates + noise
    for (let k = rng.int(0, 20); k > 0; k--) vals.push(rng.int(-500, 500));
    out.push({ name: `random runs #${i} (n=${vals.length})`, args: [rng.shuffle(vals)] });
  }
  out.push({ name: "empty", args: [[]] });
  out.push({ name: "single", args: [[9]] });
  out.push({ name: "duplicates in run", args: [[1, 2, 2, 3]] });
  return out;
}

export function stress(rng: Rng) {
  // long runs spread over a wide range; value-walking with array scans TLEs
  const vals: number[] = [];
  for (let r = 0; r < 300; r++) {
    const start = rng.int(-1_000_000, 1_000_000);
    for (let k = 0, len = rng.int(500, 1500); k < len && vals.length < 300_000; k++) vals.push(start + k);
  }
  return [{ name: "n=300000 long runs", args: [rng.shuffle(vals)] }];
}

// sort + scan (independent of the set-based optimal)
export function brute(nums: number[]): number {
  if (!nums.length) return 0;
  const a = [...new Set(nums)].sort((x, y) => x - y);
  let best = 1, cur = 1;
  for (let i = 1; i < a.length; i++) {
    cur = a[i] === a[i - 1] + 1 ? cur + 1 : 1;
    best = Math.max(best, cur);
  }
  return best;
}
