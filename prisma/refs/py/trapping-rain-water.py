def trap(height):
    if not height:
        return 0
    l, r = 0, len(height) - 1
    max_l = max_r = out = 0
    while l < r:
        if height[l] < height[r]:
            max_l = max(max_l, height[l])
            out += max_l - height[l]
            l += 1
        else:
            max_r = max(max_r, height[r])
            out += max_r - height[r]
            r -= 1
    return out
