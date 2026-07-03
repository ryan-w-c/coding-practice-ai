from collections import Counter


def min_window(s, t):
    if len(t) > len(s):
        return ""
    need = Counter(t)
    have, required = 0, len(need)
    window = {}
    best = None
    l = 0
    for r, c in enumerate(s):
        window[c] = window.get(c, 0) + 1
        if c in need and window[c] == need[c]:
            have += 1
        while have == required:
            if best is None or r - l < best[1] - best[0]:
                best = (l, r)
            lc = s[l]
            window[lc] -= 1
            if lc in need and window[lc] < need[lc]:
                have -= 1
            l += 1
    return s[best[0]:best[1] + 1] if best else ""
