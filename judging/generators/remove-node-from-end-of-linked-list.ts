import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const len = rng.int(1, 300);
    out.push({ name: `random #${i} (len=${len})`, args: [rng.ints(len, -100, 100), rng.int(1, len)] });
  }
  out.push({ name: "remove only node", args: [[9], 1] });
  out.push({ name: "remove head", args: [[1, 2, 3], 3] });
  out.push({ name: "remove tail", args: [[1, 2, 3], 1] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=100000 remove middle", args: [rng.ints(100_000, -100, 100), 50_000] }];
}

export function brute(arr: number[], n: number): number[] {
  const out = [...arr];
  out.splice(arr.length - n, 1);
  return out;
}
