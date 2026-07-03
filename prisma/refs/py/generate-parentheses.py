def generate_parenthesis(n):
    res = []

    def bt(cur, open_, close):
        if len(cur) == 2 * n:
            res.append(cur)
            return
        if open_ < n:
            bt(cur + "(", open_ + 1, close)
        if close < open_:
            bt(cur + ")", open_, close + 1)

    bt("", 0, 0)
    return res
