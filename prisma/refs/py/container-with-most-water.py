def max_area(heights):
    l, r, best = 0, len(heights) - 1, 0
    while l < r:
        best = max(best, (r - l) * min(heights[l], heights[r]))
        if heights[l] < heights[r]:
            l += 1
        else:
            r -= 1
    return best
