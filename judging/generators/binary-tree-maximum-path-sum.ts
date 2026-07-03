import type { Rng } from "./_rng";
import { randomTree, levelOrderToTree } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random #${i}`, args: [randomTree(rng, rng.int(1, 150), -50, 50)] });
  }
  out.push({ name: "all negative", args: [[-3, -2, -5]] });
  out.push({ name: "single negative node", args: [[-7]] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=50000", args: [randomTree(rng, 50_000, -100, 100)] }];
}

type T = { val: number; left: T | null; right: T | null };

// per-node: best downward chain on each side, recomputed independently (O(n^2))
export function brute(arr: (number | null)[]): number {
  const root = levelOrderToTree(arr) as T | null;
  const chain = (n: T | null): number =>
    n ? Math.max(0, n.val + Math.max(chain(n.left), chain(n.right))) : 0;
  let best = -Infinity;
  const walk = (n: T | null) => {
    if (!n) return;
    best = Math.max(best, n.val + chain(n.left) + chain(n.right));
    walk(n.left);
    walk(n.right);
  };
  walk(root);
  return best;
}
