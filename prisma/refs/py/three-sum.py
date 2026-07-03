def three_sum(nums):
    a = sorted(nums)
    res = []
    for i in range(len(a) - 2):
        if i > 0 and a[i] == a[i - 1]:
            continue
        if a[i] > 0:
            break
        l, r = i + 1, len(a) - 1
        while l < r:
            s = a[i] + a[l] + a[r]
            if s < 0:
                l += 1
            elif s > 0:
                r -= 1
            else:
                res.append([a[i], a[l], a[r]])
                while l < r and a[l] == a[l + 1]:
                    l += 1
                while l < r and a[r] == a[r - 1]:
                    r -= 1
                l += 1
                r -= 1
    return res
