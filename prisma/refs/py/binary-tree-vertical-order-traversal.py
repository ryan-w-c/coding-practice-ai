from collections import defaultdict, deque


def vertical_order(root):
    if not root:
        return []
    cols = defaultdict(list)
    q = deque([(root, 0)])
    lo = hi = 0
    while q:
        node, c = q.popleft()
        cols[c].append(node.val)
        lo, hi = min(lo, c), max(hi, c)
        if node.left:
            q.append((node.left, c - 1))
        if node.right:
            q.append((node.right, c + 1))
    return [cols[c] for c in range(lo, hi + 1)]
