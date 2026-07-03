import type { Rng } from "./_rng";

function digits(rng: Rng, len: number, nineTail: number): number[] {
  const d = rng.ints(len, 0, 9);
  d[0] = rng.int(1, 9);
  for (let i = 0; i < nineTail && i < len; i++) d[len - 1 - i] = 9;
  return len === 1 ? [rng.int(0, 9)] : d;
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random #${i}`, args: [digits(rng, rng.int(1, 80), rng.int(0, 6))] });
  }
  out.push({ name: "all nines long", args: [Array.from({ length: 40 }, () => 9)] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "10000 digits", args: [digits(rng, 10_000, 3)] }];
}

export function brute(ds: number[]): number[] {
  const s = (BigInt(ds.join("")) + 1n).toString();
  return [...s].map(Number);
}
