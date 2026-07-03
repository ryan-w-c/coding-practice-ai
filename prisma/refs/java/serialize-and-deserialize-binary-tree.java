class Codec {
    public String serialize(TreeNode root) {
        StringBuilder b = new StringBuilder();
        dfs(root, b);
        return b.toString();
    }

    private void dfs(TreeNode n, StringBuilder b) {
        if (b.length() > 0) b.append(',');
        if (n == null) {
            b.append('#');
            return;
        }
        b.append(n.val);
        dfs(n.left, b);
        dfs(n.right, b);
    }

    private int i;

    public TreeNode deserialize(String data) {
        i = 0;
        return build(data.split(","));
    }

    private TreeNode build(String[] tokens) {
        String t = tokens[i++];
        if (t.equals("#")) return null;
        TreeNode node = new TreeNode(Integer.parseInt(t));
        node.left = build(tokens);
        node.right = build(tokens);
        return node;
    }
}
