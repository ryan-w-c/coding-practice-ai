def solve(board):
    m, n = len(board), len(board[0]) if board else 0
    stack = [(r, c) for r in range(m) for c in (0, n - 1) if board[r][c] == "O"]
    stack += [(r, c) for c in range(n) for r in (0, m - 1) if board[r][c] == "O"]
    while stack:
        r, c = stack.pop()
        if board[r][c] != "O":
            continue
        board[r][c] = "S"
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n and board[nr][nc] == "O":
                stack.append((nr, nc))
    for r in range(m):
        for c in range(n):
            board[r][c] = "O" if board[r][c] == "S" else "X"
