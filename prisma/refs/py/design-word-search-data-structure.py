class WordDictionary:
    def __init__(self):
        self.root = {}

    def addWord(self, word):
        node = self.root
        for c in word:
            node = node.setdefault(c, {})
        node["$"] = True

    def search(self, word):
        def dfs(node, i):
            if i == len(word):
                return "$" in node
            c = word[i]
            if c == ".":
                return any(dfs(child, i + 1) for k, child in node.items() if k != "$")
            return c in node and dfs(node[c], i + 1)

        return dfs(self.root, 0)
