def reverse(x):
    sign = -1 if x < 0 else 1
    out = sign * int(str(abs(x))[::-1])
    return out if -2**31 <= out <= 2**31 - 1 else 0
