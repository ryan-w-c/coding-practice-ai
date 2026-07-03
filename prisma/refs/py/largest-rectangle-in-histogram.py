def largest_rectangle_area(heights):
    stack, best = [], 0
    for i in range(len(heights) + 1):
        h = 0 if i == len(heights) else heights[i]
        while stack and heights[stack[-1]] >= h:
            top = stack.pop()
            left = stack[-1] + 1 if stack else 0
            best = max(best, heights[top] * (i - left))
        stack.append(i)
    return best
