import type { Rng } from "./_rng";
import { randomBst, treeValues, levelOrderToTree, treeToLevelOrder } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const arr = randomBst(rng, rng.int(2, 200));
    const vals = treeValues(arr);
    const p = rng.pick(vals);
    let q = rng.pick(vals);
    let guard = 0;
    while (q === p && guard++ < 50) q = rng.pick(vals);
    if (q === p) continue;
    out.push({ name: `random #${i} (n=${vals.length})`, args: [arr, p, q] });
  }
  return out;
}

export function stress(rng: Rng) {
  const arr = randomBst(rng, 50_000);
  const vals = treeValues(arr);
  return [{ name: "n=50000", args: [arr, vals[0], vals[vals.length - 1]] }];
}

type T = { val: number; left: T | null; right: T | null };

// collect both root-paths, take the last common node
export function brute(arr: (number | null)[], p: number, q: number): (number | null)[] {
  const root = levelOrderToTree(arr) as T | null;
  const pathTo = (target: number): T[] => {
    const path: T[] = [];
    let cur = root;
    while (cur) {
      path.push(cur);
      if (target === cur.val) break;
      cur = target < cur.val ? cur.left : cur.right;
    }
    return path;
  };
  const a = pathTo(p), b = pathTo(q);
  let lca: T | null = null;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] === b[i]) lca = a[i];
    else break;
  }
  return treeToLevelOrder(lca as never);
}
