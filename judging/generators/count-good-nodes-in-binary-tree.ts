import type { Rng } from "./_rng";
import { randomTree, levelOrderToTree } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    out.push({ name: `random #${i}`, args: [randomTree(rng, rng.int(1, 200), -20, 20)] });
  }
  out.push({ name: "strictly increasing chain (all good)", args: [[1, null, 2, null, 3]] });
  out.push({ name: "strictly decreasing chain (only root)", args: [[3, 2, null, 1, null]] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=100000", args: [randomTree(rng, 100_000, -50, 50)] }];
}

type T = { val: number; left: T | null; right: T | null };

export function brute(arr: (number | null)[]): number {
  const root = levelOrderToTree(arr) as T | null;
  let count = 0;
  const walk = (n: T | null, max: number) => {
    if (!n) return;
    if (n.val >= max) count++;
    const m = Math.max(max, n.val);
    walk(n.left, m);
    walk(n.right, m);
  };
  walk(root, -Infinity);
  return count;
}
