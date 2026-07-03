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
  // a deep chain makes recompute-height-per-node O(n^2); 10k keeps legitimate
  // recursive solutions inside every language's stack limit (LC's own cap)
  const left: (number | null)[] = [rng.int(-100, 100)];
  for (let i = 1; i < 10_000; i++) left.push(rng.int(-100, 100), null);
  const right: (number | null)[] = [rng.int(-100, 100)];
  for (let i = 1; i < 10_000; i++) right.push(null, rng.int(-100, 100));
  // two chains: the 10s budget is global, so an O(n^2) naive pays twice while
  // per-case recursion depth stays at LC's 10^4 cap
  return [
    { name: "n=100000 bushy", args: [randomTree(rng, 100_000)] },
    { name: "n=10000 left chain", args: [left] },
    { name: "n=10000 right chain", args: [right] },
  ];
}

type T = { val: number; left: T | null; right: T | null };

// O(n^2): diameter through every node = leftHeight + rightHeight
export function brute(arr: (number | null)[]): number {
  const root = levelOrderToTree(arr) as T | null;
  const height = (n: T | null): number => (n ? 1 + Math.max(height(n.left), height(n.right)) : 0);
  let best = 0;
  const walk = (n: T | null) => {
    if (!n) return;
    best = Math.max(best, height(n.left) + height(n.right));
    walk(n.left);
    walk(n.right);
  };
  walk(root);
  return best;
}
