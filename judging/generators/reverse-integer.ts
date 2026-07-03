import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    out.push({ name: `random #${i}`, args: [rng.int(-2_147_483_648, 2_147_483_647)] });
  }
  // overflow-adjacent territory: 10-digit values whose reversals straddle 2^31
  for (let i = 0; i < 6; i++) {
    out.push({ name: `ten-digit #${i}`, args: [rng.int(1_000_000_000, 2_147_483_647) * (rng.next() < 0.5 ? -1 : 1)] });
  }
  return out;
}

export function brute(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const out = sign * Number([...String(Math.abs(x))].reverse().join(""));
  return out < -(2 ** 31) || out > 2 ** 31 - 1 ? 0 : out;
}
