import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 8; i++) {
    const n = rng.int(0, 300);
    out.push({ name: `random #${i} (n=${n})`, args: [rng.ints(n, -1000, 1000)] });
  }
  out.push({ name: "empty list", args: [[]] });
  out.push({ name: "single node", args: [[7]] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=5000 (recursion-friendly max)", args: [rng.ints(5000, -1000, 1000)] }];
}

export function brute(arr: number[]): number[] {
  return [...arr].reverse();
}
