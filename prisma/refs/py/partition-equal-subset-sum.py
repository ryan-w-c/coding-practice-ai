def can_partition(nums):
    total = sum(nums)
    if total % 2:
        return False
    target = total // 2
    reachable = {0}
    for n in nums:
        reachable |= {s + n for s in reachable if s + n <= target}
        if target in reachable:
            return True
    return target in reachable
