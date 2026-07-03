def max_product(nums):
    best = hi = lo = nums[0]
    for n in nums[1:]:
        cands = (n, hi * n, lo * n)
        hi, lo = max(cands), min(cands)
        best = max(best, hi)
    return best
