import java.util.*;

class Solution {
    public int largestRectangleArea(int[] heights) {
        Deque<Integer> stack = new ArrayDeque<>();
        int best = 0;
        for (int i = 0; i <= heights.length; i++) {
            int h = i == heights.length ? 0 : heights[i];
            while (!stack.isEmpty() && heights[stack.peek()] >= h) {
                int top = stack.pop();
                int left = stack.isEmpty() ? 0 : stack.peek() + 1;
                best = Math.max(best, heights[top] * (i - left));
            }
            stack.push(i);
        }
        return best;
    }
}
