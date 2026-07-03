// Shared random-input builders for case generators. Everything takes the
// seeded Rng so generation stays deterministic per problem.
import type { Rng } from "./_rng";

/** Strictly increasing ints starting near `start` with gaps in [1, maxGap]. */
export function sortedDistinct(rng: Rng, n: number, start: number, maxGap: number): number[] {
  const out: number[] = [];
  let v = start;
  for (let i = 0; i < n; i++) {
    v += rng.int(1, maxGap);
    out.push(v);
  }
  return out;
}

/** Random binary tree in level-order-with-nulls form (the neutral TreeNode JSON). */
export function randomTree(rng: Rng, n: number, lo = -100, hi = 100): (number | null)[] {
  if (n === 0) return [];
  // Build parent slots BFS-style: each existing node may or may not have children.
  const out: (number | null)[] = [rng.int(lo, hi)];
  let remaining = n - 1;
  let frontier = 1; // nodes in the current serialization that can take children
  while (remaining > 0 && frontier > 0) {
    let nextFrontier = 0;
    for (let i = 0; i < frontier && remaining > 0; i++) {
      for (let child = 0; child < 2; child++) {
        if (remaining > 0 && rng.next() < 0.75) {
          out.push(rng.int(lo, hi));
          remaining--;
          nextFrontier++;
        } else {
          out.push(null);
        }
      }
    }
    frontier = nextFrontier;
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

/** Random BST with n DISTINCT values, as level-order-with-nulls. */
export function randomBst(rng: Rng, n: number, lo = -1000, maxGap = 20): (number | null)[] {
  const values = rng.shuffle(sortedDistinct(rng, n, lo, maxGap));
  type Node = { val: number; left: Node | null; right: Node | null };
  let root: Node | null = null;
  for (const v of values) {
    const node: Node = { val: v, left: null, right: null };
    if (!root) { root = node; continue; }
    let cur = root;
    for (;;) {
      if (v < cur.val) {
        if (!cur.left) { cur.left = node; break; }
        cur = cur.left;
      } else {
        if (!cur.right) { cur.right = node; break; }
        cur = cur.right;
      }
    }
  }
  return treeToLevelOrder(root);
}

type TN = { val: number; left: TN | null; right: TN | null };

export function levelOrderToTree(arr: (number | null)[]): TN | null {
  if (!arr.length || arr[0] === null) return null;
  const root: TN = { val: arr[0], left: null, right: null };
  const q: TN[] = [root];
  let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    const l = arr[i++];
    if (l !== null && l !== undefined) { node.left = { val: l, left: null, right: null }; q.push(node.left); }
    const r = arr[i++];
    if (r !== null && r !== undefined) { node.right = { val: r, left: null, right: null }; q.push(node.right); }
  }
  return root;
}

export function treeToLevelOrder(root: TN | null): (number | null)[] {
  const out: (number | null)[] = [];
  const q: (TN | null)[] = [root];
  while (q.length) {
    const node = q.shift();
    if (node) {
      out.push(node.val);
      q.push(node.left, node.right);
    } else {
      out.push(null);
    }
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

/** All node values of a level-order tree (ignoring nulls). */
export function treeValues(arr: (number | null)[]): number[] {
  return arr.filter((v): v is number => v !== null);
}

/** Random lowercase word. */
export function word(rng: Rng, minLen: number, maxLen: number, alphabet = "abcdefghijklmnopqrstuvwxyz"): string {
  return rng.str(rng.int(minLen, maxLen), alphabet);
}

/** Random intervals [start, end] with start <= end. */
export function intervals(rng: Rng, n: number, lo: number, hi: number, maxLen: number): number[][] {
  return Array.from({ length: n }, () => {
    const s = rng.int(lo, hi);
    return [s, s + rng.int(0, maxLen)];
  });
}

/** Random connected undirected graph edge list on nodes 0..n-1 (tree + extras). */
export function connectedGraph(rng: Rng, n: number, extraEdges: number): number[][] {
  const edges: number[][] = [];
  const seen = new Set<string>();
  for (let v = 1; v < n; v++) {
    const u = rng.int(0, v - 1);
    edges.push([u, v]);
    seen.add(`${u},${v}`);
  }
  let guard = 0;
  while (extraEdges > 0 && guard++ < 1000 && n > 2) {
    const a = rng.int(0, n - 1), b = rng.int(0, n - 1);
    const [u, v] = a < b ? [a, b] : [b, a];
    if (u === v || seen.has(`${u},${v}`)) continue;
    seen.add(`${u},${v}`);
    edges.push([u, v]);
    extraEdges--;
  }
  return rng.shuffle(edges);
}
