def num_distinct(s, t):
    n = len(t)
    dp = [0] * (n + 1)
    dp[0] = 1
    for c in s:
        for j in range(n, 0, -1):
            if t[j - 1] == c:
                dp[j] += dp[j - 1]
    return dp[n]
