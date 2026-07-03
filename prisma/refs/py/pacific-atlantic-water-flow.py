def pacific_atlantic(heights):
    m, n = len(heights), len(heights[0]) if heights else 0
    if not m or not n:
        return []

    def dfs(r, c, seen):
        seen.add((r, c))
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n and (nr, nc) not in seen \
                    and heights[nr][nc] >= heights[r][c]:
                dfs(nr, nc, seen)

    pac, atl = set(), set()
    for r in range(m):
        dfs(r, 0, pac)
        dfs(r, n - 1, atl)
    for c in range(n):
        dfs(0, c, pac)
        dfs(m - 1, c, atl)
    return [[r, c] for r in range(m) for c in range(n) if (r, c) in pac and (r, c) in atl]
