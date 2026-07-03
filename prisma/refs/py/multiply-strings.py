def multiply(num1, num2):
    if num1 == "0" or num2 == "0":
        return "0"
    m, n = len(num1), len(num2)
    acc = [0] * (m + n)
    for i in range(m - 1, -1, -1):
        for j in range(n - 1, -1, -1):
            prod = int(num1[i]) * int(num2[j]) + acc[i + j + 1]
            acc[i + j + 1] = prod % 10
            acc[i + j] += prod // 10
    out = "".join(map(str, acc)).lstrip("0")
    return out
