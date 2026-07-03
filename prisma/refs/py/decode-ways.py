def num_decodings(s):
    if s[0] == "0":
        return 0
    prev, cur = 1, 1
    for i in range(1, len(s)):
        ways = 0
        if s[i] != "0":
            ways += cur
        if 10 <= int(s[i - 1:i + 1]) <= 26:
            ways += prev
        prev, cur = cur, ways
    return cur
