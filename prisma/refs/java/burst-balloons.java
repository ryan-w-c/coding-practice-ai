class Solution {
    public int maxCoins(int[] nums) {
        int n = nums.length + 2;
        int[] a = new int[n];
        a[0] = a[n - 1] = 1;
        for (int i = 0; i < nums.length; i++) a[i + 1] = nums[i];
        int[][] dp = new int[n][n];
        for (int len = 2; len < n; len++)
            for (int l = 0; l + len < n; l++) {
                int r = l + len;
                for (int k = l + 1; k < r; k++)
                    dp[l][r] = Math.max(dp[l][r], dp[l][k] + a[l] * a[k] * a[r] + dp[k][r]);
            }
        return dp[0][n - 1];
    }
}
