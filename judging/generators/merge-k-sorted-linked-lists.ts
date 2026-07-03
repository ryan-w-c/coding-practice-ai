import type { Rng } from "./_rng";

const sorted = (rng: Rng, n: number) => rng.ints(n, -10_000, 10_000).sort((a, b) => a - b);

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const k = rng.int(0, 20);
    out.push({ name: `random #${i} (k=${k})`, args: [Array.from({ length: k }, () => sorted(rng, rng.int(0, 60)))] });
  }
  out.push({ name: "all lists empty", args: [[[], [], []]] });
  out.push({ name: "single long list", args: [[sorted(rng, 100)]] });
  return out;
}

export function stress(rng: Rng) {
  // many small lists: merging one-at-a-time is O(k * total)
  return [{ name: "k=5000 lists of 40", args: [Array.from({ length: 5000 }, () => sorted(rng, 40))] }];
}

export function brute(lists: number[][]): number[] {
  return lists.flat().sort((a, b) => a - b);
}
