import type { Rng } from "./_rng";
import { randomTree, levelOrderToTree } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    out.push({ name: `random #${i}`, args: [randomTree(rng, rng.int(0, 200))] });
  }
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=100000", args: [randomTree(rng, 100_000)] }];
}

type T = { val: number; left: T | null; right: T | null };

export function brute(arr: (number | null)[]): number[][] {
  const root = levelOrderToTree(arr) as T | null;
  const out: number[][] = [];
  const walk = (n: T | null, d: number) => {
    if (!n) return;
    (out[d] ??= []).push(n.val); // preorder = left-to-right within a level
    walk(n.left, d + 1);
    walk(n.right, d + 1);
  };
  walk(root, 0);
  return out;
}
