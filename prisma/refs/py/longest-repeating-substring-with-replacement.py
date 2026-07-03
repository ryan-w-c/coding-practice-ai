from collections import defaultdict


def character_replacement(s, k):
    count = defaultdict(int)
    l = max_freq = best = 0
    for r, c in enumerate(s):
        count[c] += 1
        max_freq = max(max_freq, count[c])
        while r - l + 1 - max_freq > k:
            count[s[l]] -= 1
            l += 1
        best = max(best, r - l + 1)
    return best
