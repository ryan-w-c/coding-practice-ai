import type { Rng } from "./_rng";
import { randomTree } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const a = randomTree(rng, rng.int(0, 150));
    let b: (number | null)[];
    const kind = i % 3;
    if (kind === 0) b = [...a]; // identical
    else if (kind === 1 && a.length) {
      b = [...a];
      // mutate one value
      const idxs = b.map((v, k) => (v !== null ? k : -1)).filter((k) => k >= 0);
      const at = rng.pick(idxs);
      b[at] = (b[at] as number) + rng.int(1, 5);
    } else b = randomTree(rng, rng.int(0, 150)); // unrelated (may rarely match tiny trees)
    out.push({ name: `random #${i}`, args: [a, b] });
  }
  out.push({ name: "both empty", args: [[], []] });
  out.push({ name: "shape differs same values", args: [[1, 2], [1, null, 2]] });
  return out;
}

export function stress(rng: Rng) {
  const big = randomTree(rng, 100_000);
  return [{ name: "n=100000 identical", args: [big, [...big]] }];
}

export function brute(a: (number | null)[], b: (number | null)[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b); // level-order-with-nulls is canonical
}
