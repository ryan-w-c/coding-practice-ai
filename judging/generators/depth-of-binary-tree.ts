import type { Rng } from "./_rng";
import { randomTree, levelOrderToTree } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    out.push({ name: `random #${i}`, args: [randomTree(rng, rng.int(0, 250))] });
  }
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=100000", args: [randomTree(rng, 100_000)] }];
}

export function brute(arr: (number | null)[]): number {
  type T = { val: number; left: T | null; right: T | null };
  const depth = (n: T | null): number => (n ? 1 + Math.max(depth(n.left), depth(n.right)) : 0);
  return depth(levelOrderToTree(arr) as T | null);
}
