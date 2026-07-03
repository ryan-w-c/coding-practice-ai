import type { Rng } from "./_rng";
import { randomTree, levelOrderToTree } from "./_shared";

// perfect tree of given depth, then optionally graft a chain to unbalance it
function perfect(rng: Rng, depth: number): (number | null)[] {
  return Array.from({ length: 2 ** depth - 1 }, () => rng.int(-100, 100));
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 6; i++) {
    out.push({ name: `perfect (balanced) #${i}`, args: [perfect(rng, rng.int(1, 7))] });
  }
  for (let i = 0; i < 6; i++) {
    out.push({ name: `random shape #${i}`, args: [randomTree(rng, rng.int(0, 150))] });
  }
  // left chain: definitely unbalanced beyond depth 2
  const chainLen = rng.int(3, 30);
  const chain: (number | null)[] = [0];
  for (let d = 1; d < chainLen; d++) {
    chain.push(d, null);
  }
  out.push({ name: "left chain (unbalanced)", args: [chain] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=100000 random", args: [randomTree(rng, 100_000)] }];
}

type T = { val: number; left: T | null; right: T | null };

export function brute(arr: (number | null)[]): boolean {
  const root = levelOrderToTree(arr) as T | null;
  const height = (n: T | null): number => (n ? 1 + Math.max(height(n.left), height(n.right)) : 0);
  const ok = (n: T | null): boolean =>
    !n || (Math.abs(height(n.left) - height(n.right)) <= 1 && ok(n.left) && ok(n.right));
  return ok(root);
}
