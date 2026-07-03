def get_sum(a, b):
    mask = 0xFFFFFFFF
    a &= mask
    b &= mask
    while b:
        carry = ((a & b) << 1) & mask
        a ^= b
        b = carry
    return a if a <= 0x7FFFFFFF else ~(a ^ mask)
