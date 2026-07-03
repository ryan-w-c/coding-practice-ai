def find_words(board, words):
    root = {}
    for w in words:
        node = root
        for c in w:
            node = node.setdefault(c, {})
        node["$"] = w

    m, n = len(board), len(board[0])
    out = []

    def dfs(r, c, node):
        ch = board[r][c]
        nxt = node.get(ch)
        if nxt is None:
            return
        if "$" in nxt:
            out.append(nxt.pop("$"))
        board[r][c] = "#"
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n and board[nr][nc] != "#":
                dfs(nr, nc, nxt)
        board[r][c] = ch

    for r in range(m):
        for c in range(n):
            dfs(r, c, root)
    return out
