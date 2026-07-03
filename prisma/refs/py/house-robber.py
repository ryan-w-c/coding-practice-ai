def rob(nums):
    take = skip = 0
    for n in nums:
        take, skip = skip + n, max(take, skip)
    return max(take, skip)
