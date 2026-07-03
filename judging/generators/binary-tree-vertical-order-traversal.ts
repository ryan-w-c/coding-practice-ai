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
  return [{ name: "n=50000", args: [randomTree(rng, 50_000)] }];
}

type T = { val: number; left: T | null; right: T | null };

// DFS collect (col, row, preorder-seq), sort — equals BFS vertical order
export function brute(arr: (number | null)[]): number[][] {
  const root = levelOrderToTree(arr) as T | null;
  if (!root) return [];
  const entries: [number, number, number, number][] = []; // col, row, seq, val
  let seq = 0;
  const walk = (n: T | null, row: number, col: number) => {
    if (!n) return;
    entries.push([col, row, seq++, n.val]);
    walk(n.left, row + 1, col - 1);
    walk(n.right, row + 1, col + 1);
  };
  walk(root, 0, 0);
  entries.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
  const out: number[][] = [];
  let lastCol = Number.NaN;
  for (const [col, , , val] of entries) {
    if (col !== lastCol) { out.push([]); lastCol = col; }
    out[out.length - 1].push(val);
  }
  return out;
}
