import type { Rng } from "./_rng";

// reversed-digit lists; no leading zeros in the underlying numbers
function digitsOf(rng: Rng, len: number): number[] {
  const d = rng.ints(len, 0, 9);
  d[len - 1] = rng.int(1, 9); // most significant digit (last in reversed order)
  return len === 1 ? [rng.int(0, 9)] : d;
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    out.push({ name: `random #${i}`, args: [digitsOf(rng, rng.int(1, 100)), digitsOf(rng, rng.int(1, 100))] });
  }
  out.push({ name: "zero plus zero", args: [[0], [0]] });
  out.push({ name: "carry cascades", args: [[9, 9, 9], [1]] });
  out.push({ name: "different lengths", args: [[9, 9], [1, 0, 0, 1]] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "10000-digit numbers", args: [digitsOf(rng, 10_000), digitsOf(rng, 10_000)] }];
}

export function brute(a: number[], b: number[]): number[] {
  const num = (d: number[]) => BigInt([...d].reverse().join(""));
  const sum = (num(a) + num(b)).toString();
  return [...sum].reverse().map(Number);
}
