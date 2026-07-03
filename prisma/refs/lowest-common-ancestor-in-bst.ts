type TreeNode = { val: number; left: TreeNode | null; right: TreeNode | null };

export function lowestCommonAncestor(root: TreeNode | null, p: number, q: number): TreeNode | null {
  let cur = root;
  while (cur) {
    if (p < cur.val && q < cur.val) cur = cur.left;
    else if (p > cur.val && q > cur.val) cur = cur.right;
    else return cur;
  }
  return null;
}
