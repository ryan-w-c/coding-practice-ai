def spiral_order(matrix):
    out = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        out.extend(matrix[top][c] for c in range(left, right + 1))
        top += 1
        out.extend(matrix[r][right] for r in range(top, bottom + 1))
        right -= 1
        if top <= bottom:
            out.extend(matrix[bottom][c] for c in range(right, left - 1, -1))
            bottom -= 1
        if left <= right:
            out.extend(matrix[r][left] for r in range(bottom, top - 1, -1))
            left += 1
    return out
