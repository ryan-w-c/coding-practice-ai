import type { Rng } from "./_rng";
import { randomBst, randomTree, levelOrderToTree } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 6; i++) {
    out.push({ name: `valid bst #${i}`, args: [randomBst(rng, rng.int(1, 150))] });
  }
  for (let i = 0; i < 4; i++) {
    // corrupt one value of a valid BST
    const arr = randomBst(rng, rng.int(3, 150));
    const idxs = arr.map((v, k) => (v !== null ? k : -1)).filter((k) => k > 0);
    const at = rng.pick(idxs);
    arr[at] = (arr[at] as number) + rng.pick([-100_000, 100_000]);
    out.push({ name: `corrupted bst #${i}`, args: [arr] });
  }
  for (let i = 0; i < 3; i++) {
    out.push({ name: `random shape #${i}`, args: [randomTree(rng, rng.int(1, 60), -20, 20)] });
  }
  // the classic trap: valid locally, invalid via grandparent
  out.push({ name: "grandparent violation", args: [[5, 4, 6, null, null, 3, 7]] });
  out.push({ name: "duplicate value invalid", args: [[2, 2, 2]] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=50000 valid bst", args: [randomBst(rng, 50_000)] }];
}

type T = { val: number; left: T | null; right: T | null };

// inorder traversal must be strictly increasing
export function brute(arr: (number | null)[]): boolean {
  const vals: number[] = [];
  const walk = (n: T | null) => {
    if (!n) return;
    walk(n.left);
    vals.push(n.val);
    walk(n.right);
  };
  walk(levelOrderToTree(arr) as T | null);
  return vals.every((v, i) => i === 0 || vals[i - 1] < v);
}
