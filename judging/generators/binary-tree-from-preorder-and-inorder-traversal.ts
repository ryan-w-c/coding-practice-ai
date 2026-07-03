import type { Rng } from "./_rng";
import { randomTree, levelOrderToTree, treeToLevelOrder, sortedDistinct } from "./_shared";

type T = { val: number; left: T | null; right: T | null };

// random tree with DISTINCT values → emit its preorder + inorder
function makeInput(rng: Rng, n: number) {
  const shape = randomTree(rng, n, 0, 0);
  const values = rng.shuffle(sortedDistinct(rng, n, -10_000, 5));
  let vi = 0;
  const root = levelOrderToTree(shape) as T | null;
  const assign = (node: T | null) => {
    if (!node) return;
    node.val = values[vi++];
    assign(node.left);
    assign(node.right);
  };
  assign(root);
  const pre: number[] = [], ino: number[] = [];
  const walk = (node: T | null) => {
    if (!node) return;
    pre.push(node.val);
    walk(node.left);
    ino.push(node.val);
    walk(node.right);
  };
  const walkIn = (node: T | null) => {
    if (!node) return;
    walkIn(node.left);
    walkIn(node.right);
  };
  walk(root);
  return { pre, ino, level: treeToLevelOrder(root as never) };
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const { pre, ino } = makeInput(rng, rng.int(1, 150));
    out.push({ name: `random #${i} (n=${pre.length})`, args: [pre, ino] });
  }
  return out;
}

export function stress(rng: Rng) {
  // index-scan-per-node reconstruction is O(n^2)
  const { pre, ino } = makeInput(rng, 30_000);
  return [{ name: "n=30000", args: [pre, ino] }];
}

export function brute(preorder: number[], inorder: number[]): (number | null)[] {
  const build = (pre: number[], ino: number[]): T | null => {
    if (!pre.length) return null;
    const rootVal = pre[0];
    const at = ino.indexOf(rootVal);
    return {
      val: rootVal,
      left: build(pre.slice(1, at + 1), ino.slice(0, at)),
      right: build(pre.slice(at + 1), ino.slice(at + 1)),
    };
  };
  return treeToLevelOrder(build(preorder, inorder) as never);
}
