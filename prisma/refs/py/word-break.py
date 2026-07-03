def word_break(s, word_dict):
    words = set(word_dict)
    max_len = max(map(len, word_dict))
    dp = [False] * (len(s) + 1)
    dp[0] = True
    for i in range(1, len(s) + 1):
        for j in range(max(0, i - max_len), i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[len(s)]
