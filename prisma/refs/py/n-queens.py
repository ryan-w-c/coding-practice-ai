def solve_n_queens(n):
    res, board = [], []
    cols, d1, d2 = set(), set(), set()

    def bt(r):
        if r == n:
            res.append(["." * c + "Q" + "." * (n - c - 1) for c in board])
            return
        for c in range(n):
            if c in cols or (r - c) in d1 or (r + c) in d2:
                continue
            cols.add(c); d1.add(r - c); d2.add(r + c); board.append(c)
            bt(r + 1)
            cols.discard(c); d1.discard(r - c); d2.discard(r + c); board.pop()

    bt(0)
    return res
