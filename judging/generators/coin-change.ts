import type { Rng } from "./_rng";
import { sortedDistinct } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const coins = rng.shuffle(sortedDistinct(rng, rng.int(1, 6), 1, 8));
    out.push({ name: `random #${i}`, args: [coins, rng.int(0, 80)] });
  }
  out.push({ name: "amount zero", args: [[2, 5], 0] });
  out.push({ name: "unreachable amount", args: [[4, 6], 7] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "amount=10000 five coins", args: [[7, 11, 13, 29, 53], 10_000] }];
}

// BFS over amounts (independent of bottom-up dp)
export function brute(coins: number[], amount: number): number {
  if (amount === 0) return 0;
  const seen = new Set<number>([0]);
  let frontier = [0], steps = 0;
  while (frontier.length) {
    steps++;
    const next: number[] = [];
    for (const a of frontier) {
      for (const c of coins) {
        const b = a + c;
        if (b === amount) return steps;
        if (b < amount && !seen.has(b)) {
          seen.add(b);
          next.push(b);
        }
      }
    }
    frontier = next;
  }
  return -1;
}
