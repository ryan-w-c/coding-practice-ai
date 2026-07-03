from collections import Counter


def check_inclusion(s1, s2):
    n1 = len(s1)
    if n1 > len(s2):
        return False
    need = Counter(s1)
    window = Counter(s2[:n1])
    if window == need:
        return True
    for i in range(n1, len(s2)):
        window[s2[i]] += 1
        out = s2[i - n1]
        window[out] -= 1
        if window[out] == 0:
            del window[out]
        if window == need:
            return True
    return False
