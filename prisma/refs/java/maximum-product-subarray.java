class Solution {
    public int maxProduct(int[] nums) {
        int best = nums[0], hi = nums[0], lo = nums[0];
        for (int i = 1; i < nums.length; i++) {
            int n = nums[i];
            int a = n, b = hi * n, c = lo * n;
            hi = Math.max(a, Math.max(b, c));
            lo = Math.min(a, Math.min(b, c));
            best = Math.max(best, hi);
        }
        return best;
    }
}
