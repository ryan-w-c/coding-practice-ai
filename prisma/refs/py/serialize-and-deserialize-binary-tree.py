class Codec:
    def serialize(self, root):
        out = []

        def dfs(n):
            if not n:
                out.append("#")
                return
            out.append(str(n.val))
            dfs(n.left)
            dfs(n.right)

        dfs(root)
        return ",".join(out)

    def deserialize(self, data):
        tokens = iter(data.split(","))

        def build():
            t = next(tokens)
            if t == "#":
                return None
            node = TreeNode(int(t))  # noqa: F821 (injected by harness)
            node.left = build()
            node.right = build()
            return node

        return build()
