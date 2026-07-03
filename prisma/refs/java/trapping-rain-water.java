class Solution {
    public int trap(int[] height) {
        if (height.length == 0) return 0;
        int l = 0, r = height.length - 1;
        int maxL = 0, maxR = 0, out = 0;
        while (l < r) {
            if (height[l] < height[r]) {
                maxL = Math.max(maxL, height[l]);
                out += maxL - height[l];
                l++;
            } else {
                maxR = Math.max(maxR, height[r]);
                out += maxR - height[r];
                r--;
            }
        }
        return out;
    }
}
