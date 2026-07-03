type TreeNode = { val: number; left: TreeNode | null; right: TreeNode | null };

export class Codec {
  serialize(root: TreeNode | null): string {
    const out: string[] = [];
    const dfs = (n: TreeNode | null) => {
      if (!n) {
        out.push("#");
        return;
      }
      out.push(String(n.val));
      dfs(n.left);
      dfs(n.right);
    };
    dfs(root);
    return out.join(",");
  }

  deserialize(data: string): TreeNode | null {
    const tokens = data.split(",");
    let i = 0;
    const build = (): TreeNode | null => {
      const t = tokens[i++];
      if (t === "#") return null;
      const node: TreeNode = { val: Number(t), left: null, right: null };
      node.left = build();
      node.right = build();
      return node;
    };
    return build();
  }
}
