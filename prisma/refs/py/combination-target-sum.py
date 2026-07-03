def combination_sum(nums, target):
    res, cur = [], []

    def bt(start, rem):
        if rem == 0:
            res.append(cur[:])
            return
        if rem < 0:
            return
        for i in range(start, len(nums)):
            cur.append(nums[i])
            bt(i, rem - nums[i])
            cur.pop()

    bt(0, target)
    return res
