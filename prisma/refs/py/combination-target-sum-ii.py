def combination_sum2(candidates, target):
    nums = sorted(candidates)
    res, cur = [], []

    def bt(start, rem):
        if rem == 0:
            res.append(cur[:])
            return
        for i in range(start, len(nums)):
            if nums[i] > rem:
                break
            if i > start and nums[i] == nums[i - 1]:
                continue
            cur.append(nums[i])
            bt(i + 1, rem - nums[i])
            cur.pop()

    bt(0, target)
    return res
