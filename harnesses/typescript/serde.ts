// (De)serialization between neutral JSON and TypeScript runtime values.
// Structured nodes are plain {val,next}/{val,left,right} objects — structural
// typing means the user's solution can read/rewire them without importing a class.

type ListNode = { val: number; next: ListNode | null };
type TreeNode = { val: number; left: TreeNode | null; right: TreeNode | null };
type RandomNode = { val: number; next: RandomNode | null; random: RandomNode | null };
type GraphNode = { val: number; neighbors: GraphNode[] };

function listFromArray(arr: number[]): ListNode | null {
  let head: ListNode | null = null;
  for (let i = arr.length - 1; i >= 0; i--) head = { val: arr[i], next: head };
  return head;
}

function listToArray(node: ListNode | null): number[] {
  const out: number[] = [];
  let cur = node;
  const seen = new Set<ListNode>();
  while (cur) {
    if (seen.has(cur)) break; // guard against cycles
    seen.add(cur);
    out.push(cur.val);
    cur = cur.next;
  }
  return out;
}

// Standard LeetCode BFS level-order with nulls.
function treeFromArray(arr: (number | null)[]): TreeNode | null {
  if (!arr.length || arr[0] === null) return null;
  const root: TreeNode = { val: arr[0]!, left: null, right: null };
  const queue: TreeNode[] = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length) {
      const l = arr[i++];
      if (l !== null && l !== undefined) {
        node.left = { val: l, left: null, right: null };
        queue.push(node.left);
      }
    }
    if (i < arr.length) {
      const r = arr[i++];
      if (r !== null && r !== undefined) {
        node.right = { val: r, left: null, right: null };
        queue.push(node.right);
      }
    }
  }
  return root;
}

function treeToArray(root: TreeNode | null): (number | null)[] {
  const out: (number | null)[] = [];
  const queue: (TreeNode | null)[] = [root];
  while (queue.length) {
    const node = queue.shift();
    if (node) {
      out.push(node.val);
      queue.push(node.left, node.right);
    } else {
      out.push(null);
    }
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

// Cyclic list: {"values":[1,2,3],"pos":1} — tail.next points at values[pos] (-1 = no cycle).
function cycleListFromSpec(spec: { values: number[]; pos: number }): ListNode | null {
  const nodes = (spec.values ?? []).map((v) => ({ val: v, next: null as ListNode | null }));
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
  if (spec.pos >= 0 && nodes.length) nodes[nodes.length - 1].next = nodes[spec.pos];
  return nodes[0] ?? null;
}

// Random-pointer list: [[val, randomIndex|null], ...] (LeetCode copy-random-list format).
function randomListFromArray(pairs: [number, number | null][]): RandomNode | null {
  const nodes = (pairs ?? []).map(([v]) => ({ val: v, next: null, random: null }) as RandomNode);
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].next = nodes[i + 1] ?? null;
    const r = pairs[i][1];
    nodes[i].random = r === null || r === undefined ? null : nodes[r];
  }
  return nodes[0] ?? null;
}

function randomListToArray(head: RandomNode | null): [number, number | null][] {
  const index = new Map<RandomNode, number>();
  for (let cur = head; cur && !index.has(cur); cur = cur.next) index.set(cur, index.size);
  const out: [number, number | null][] = [];
  for (let cur = head; cur && out.length < index.size; cur = cur.next) {
    out.push([cur.val, cur.random ? (index.get(cur.random) ?? -1) : null]);
  }
  return out;
}

// Graph: LeetCode clone-graph adjacency list — adj[i] lists the vals of node (i+1)'s
// neighbors. Serialization sorts each neighbor list so neighbor order can't fail a case.
function graphFromAdj(adj: number[][]): GraphNode | null {
  const nodes = (adj ?? []).map((_, i) => ({ val: i + 1, neighbors: [] }) as GraphNode);
  adj?.forEach((ns, i) => { nodes[i].neighbors = ns.map((v) => nodes[v - 1]); });
  return nodes[0] ?? null;
}

function graphToAdj(node: GraphNode | null): number[][] {
  if (!node) return [];
  const seen = new Map<GraphNode, number>();
  const queue = [node];
  seen.set(node, node.val);
  while (queue.length) {
    const cur = queue.shift()!;
    for (const nb of cur.neighbors ?? []) {
      if (!seen.has(nb)) { seen.set(nb, nb.val); queue.push(nb); }
    }
  }
  const out: number[][] = Array.from({ length: seen.size }, () => []);
  for (const n of seen.keys()) {
    const i = n.val - 1;
    if (i < 0 || i >= out.length) return [[-1]]; // vals not 1..n — can't match any expected
    out[i] = (n.neighbors ?? []).map((nb) => nb.val).sort((a, b) => a - b);
  }
  return out;
}

// mustCopy support: every node reachable from a returned structure must be a fresh
// allocation, not one reachable from the input.
export function collectNodes(root: unknown): Set<object> {
  const seen = new Set<object>();
  const stack = [root];
  while (stack.length) {
    const v = stack.pop();
    if (v === null || typeof v !== "object" || seen.has(v as object)) continue;
    seen.add(v as object);
    const o = v as Record<string, unknown>;
    for (const k of ["next", "left", "right", "random"]) if (o[k]) stack.push(o[k]);
    if (Array.isArray(o.neighbors)) stack.push(...o.neighbors);
    if (Array.isArray(v)) stack.push(...(v as unknown[]));
  }
  return seen;
}

export function sharesNodes(input: unknown, output: unknown): boolean {
  const inputNodes = collectNodes(input);
  for (const n of collectNodes(output)) if (inputNodes.has(n)) return true;
  return false;
}

export function deserializeArg(value: unknown, type: string): unknown {
  if (type === "ListNode") return listFromArray((value as number[]) ?? []);
  if (type === "TreeNode") return treeFromArray((value as (number | null)[]) ?? []);
  if (type === "ListNodeCycle") return cycleListFromSpec(value as { values: number[]; pos: number });
  if (type === "ListNodeRandom") return randomListFromArray((value as [number, number | null][]) ?? []);
  if (type === "GraphNode") return graphFromAdj((value as number[][]) ?? []);
  if (type === "ListNode[]") return ((value as number[][]) ?? []).map(listFromArray);
  return value;
}

export function serializeResult(value: unknown, type: string): unknown {
  if (type === "ListNode") return listToArray(value as ListNode | null);
  if (type === "TreeNode") return treeToArray(value as TreeNode | null);
  if (type === "ListNodeRandom") return randomListToArray(value as RandomNode | null);
  if (type === "GraphNode") return graphToAdj(value as GraphNode | null);
  if (type === "ListNode[]") return ((value as (ListNode | null)[]) ?? []).map(listToArray);
  return value;
}
