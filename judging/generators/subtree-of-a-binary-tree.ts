import type { Rng } from "./_rng";
import { randomTree, levelOrderToTree, treeToLevelOrder } from "./_shared";

type T = { val: number; left: T | null; right: T | null };

// graft `sub` in place of a random null slot of `root`
function graft(rng: Rng, rootArr: (number | null)[], subArr: (number | null)[]): (number | null)[] {
  const root = levelOrderToTree(rootArr) as T | null;
  const sub = levelOrderToTree(subArr) as T | null;
  if (!root) return subArr;
  const nodes: T[] = [];
  const collect = (n: T | null) => { if (n) { nodes.push(n); collect(n.left); collect(n.right); } };
  collect(root);
  const leafish = nodes.filter((n) => !n.left || !n.right);
  const host = rng.pick(leafish);
  if (!host.left) host.left = sub;
  else host.right = sub;
  return treeToLevelOrder(root as never);
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const sub = randomTree(rng, rng.int(1, 20), 0, 9); // small value range → near-misses exist
    const kind = i % 2;
    if (kind === 0) {
      const root = graft(rng, randomTree(rng, rng.int(0, 80), 0, 9), sub);
      out.push({ name: `grafted true #${i}`, args: [root, sub] });
    } else {
      out.push({ name: `random pair #${i}`, args: [randomTree(rng, rng.int(1, 80), 0, 9), sub] });
    }
  }
  out.push({ name: "identical trees", args: [[1, 2, 3], [1, 2, 3]] });
  out.push({ name: "value match shape mismatch", args: [[1, 2, null], [1, 2, 3]] });
  return out;
}

export function stress(rng: Rng) {
  const sub = randomTree(rng, 50, 0, 9);
  return [{ name: "n=20000 grafted", args: [graft(rng, randomTree(rng, 20_000, 0, 9), sub), sub] }];
}

export function brute(rootArr: (number | null)[], subArr: (number | null)[]): boolean {
  const same = (a: T | null, b: T | null): boolean =>
    (!a && !b) || (!!a && !!b && a.val === b.val && same(a.left, b.left) && same(a.right, b.right));
  const sub = levelOrderToTree(subArr) as T | null;
  let found = false;
  const walk = (n: T | null) => {
    if (!n || found) return;
    if (same(n, sub)) { found = true; return; }
    walk(n.left);
    walk(n.right);
  };
  const root = levelOrderToTree(rootArr) as T | null;
  if (!sub) return true;
  walk(root);
  return found;
}
