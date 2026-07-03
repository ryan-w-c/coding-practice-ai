def set_zeroes(matrix):
    rows = {r for r, row in enumerate(matrix) for v in row if v == 0}
    cols = {c for row in matrix for c, v in enumerate(row) if v == 0}
    for r, row in enumerate(matrix):
        for c in range(len(row)):
            if r in rows or c in cols:
                row[c] = 0
