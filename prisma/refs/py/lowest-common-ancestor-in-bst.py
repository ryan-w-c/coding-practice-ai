def lowest_common_ancestor(root, p, q):
    cur = root
    while cur:
        if p < cur.val and q < cur.val:
            cur = cur.left
        elif p > cur.val and q > cur.val:
            cur = cur.right
        else:
            return cur
    return None
