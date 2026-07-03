def clone_graph(node):
    if not node:
        return None
    mapping = {}

    def dfs(n):
        if id(n) in mapping:
            return mapping[id(n)]
        copy = Node(n.val)  # noqa: F821 (injected by harness)
        mapping[id(n)] = copy
        copy.neighbors = [dfs(nb) for nb in n.neighbors]
        return copy

    return dfs(node)
