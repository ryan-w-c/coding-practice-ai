def min_eating_speed(piles, h):
    lo, hi = 1, max(piles)
    while lo < hi:
        k = (lo + hi) // 2
        if sum(-(-p // k) for p in piles) <= h:
            hi = k
        else:
            lo = k + 1
    return lo
