class Solution {
    public int maxArea(int[] heights) {
        int l = 0, r = heights.length - 1, best = 0;
        while (l < r) {
            best = Math.max(best, (r - l) * Math.min(heights[l], heights[r]));
            if (heights[l] < heights[r]) l++;
            else r--;
        }
        return best;
    }
}
