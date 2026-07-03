class Solution {
    public int numDistinct(String s, String t) {
        int n = t.length();
        long[] dp = new long[n + 1];
        dp[0] = 1;
        for (char c : s.toCharArray())
            for (int j = n; j >= 1; j--)
                if (t.charAt(j - 1) == c) dp[j] += dp[j - 1];
        return (int) dp[n];
    }
}
