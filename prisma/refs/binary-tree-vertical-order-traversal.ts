type TreeNode = { val: number; left: TreeNode | null; right: TreeNode | null };

export function verticalOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const cols = new Map<number, number[]>();
  const queue: [TreeNode, number][] = [[root, 0]];
  let min = 0, max = 0;
  while (queue.length) {
    const [node, c] = queue.shift()!;
    if (!cols.has(c)) cols.set(c, []);
    cols.get(c)!.push(node.val);
    min = Math.min(min, c);
    max = Math.max(max, c);
    if (node.left) queue.push([node.left, c - 1]);
    if (node.right) queue.push([node.right, c + 1]);
  }
  const out: number[][] = [];
  for (let c = min; c <= max; c++) out.push(cols.get(c) ?? []);
  return out;
}
