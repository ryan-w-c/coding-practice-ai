def my_pow(x, n):
    if n == 0:
        return 1.0
    exp = abs(n)
    base, out = x, 1.0
    while exp:
        if exp & 1:
            out *= base
        base *= base
        exp >>= 1
    return 1 / out if n < 0 else out
