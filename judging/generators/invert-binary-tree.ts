import type { Rng } from "./_rng";
import { randomTree, levelOrderToTree, treeToLevelOrder } from "./_shared";

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

export function brute(arr: (number | null)[]): (number | null)[] {
  type T = { val: number; left: T | null; right: T | null };
  const swap = (n: T | null): T | null => {
    if (!n) return null;
    return { val: n.val, left: swap(n.right as T | null), right: swap(n.left as T | null) };
  };
  return treeToLevelOrder(swap(levelOrderToTree(arr) as T | null) as never);
}
