def rob(nums):
    if len(nums) == 1:
        return nums[0]

    def linear(arr):
        take = skip = 0
        for n in arr:
            take, skip = skip + n, max(take, skip)
        return max(take, skip)

    return max(linear(nums[1:]), linear(nums[:-1]))
