from collections import deque

INF = 2147483647


def fill_land_with_distance_to_treasure(grid):
    m, n = len(grid), len(grid[0]) if grid else 0
    q = deque((r, c) for r in range(m) for c in range(n) if grid[r][c] == 0)
    while q:
        r, c = q.popleft()
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == INF:
                grid[nr][nc] = grid[r][c] + 1
                q.append((nr, nc))
