import type { Rng } from "./_rng";

// n+1 values in [1, n]: all distinct except one value appearing >= 2 times
function input(rng: Rng, n: number): number[] {
  const dup = rng.int(1, n);
  const copies = rng.int(2, Math.min(4, n + 1));
  const others = rng.shuffle(
    Array.from({ length: n }, (_, i) => i + 1).filter((v) => v !== dup),
  ).slice(0, n + 1 - copies);
  return rng.shuffle([...Array.from({ length: copies }, () => dup), ...others]);
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random #${i}`, args: [input(rng, rng.int(1, 300))] });
  }
  out.push({ name: "smallest case", args: [[1, 1]] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=200000", args: [input(rng, 200_000)] }];
}

export function brute(nums: number[]): number {
  const a = [...nums].sort((x, y) => x - y);
  for (let i = 1; i < a.length; i++) if (a[i] === a[i - 1]) return a[i];
  return -1;
}
