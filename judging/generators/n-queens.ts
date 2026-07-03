import type { Rng } from "./_rng";

export function cases(_rng: Rng) {
  // the whole domain: n = 1..8 (n=9 explodes output size)
  return Array.from({ length: 8 }, (_, i) => ({ name: `n=${i + 1}`, args: [i + 1] }));
}

// bitmask backtracking (independent of the set-based ref)
export function brute(n: number): string[][] {
  const out: string[][] = [];
  const cols: number[] = [];
  const go = (row: number, colsMask: number, d1: number, d2: number) => {
    if (row === n) {
      out.push(cols.map((c) => ".".repeat(c) + "Q" + ".".repeat(n - c - 1)));
      return;
    }
    let free = ~(colsMask | d1 | d2) & ((1 << n) - 1);
    while (free) {
      const bit = free & -free;
      free ^= bit;
      cols.push(Math.log2(bit));
      go(row + 1, colsMask | bit, ((d1 | bit) << 1) & ((1 << n) - 1), (d2 | bit) >> 1);
      cols.pop();
    }
  };
  go(0, 0, 0, 0);
  return out;
}
