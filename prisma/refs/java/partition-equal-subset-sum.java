class Solution {
    public boolean canPartition(int[] nums) {
        int total = 0;
        for (int n : nums) total += n;
        if (total % 2 == 1) return false;
        int target = total / 2;
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;
        for (int n : nums)
            for (int s = target; s >= n; s--)
                if (dp[s - n]) dp[s] = true;
        return dp[target];
    }
}
