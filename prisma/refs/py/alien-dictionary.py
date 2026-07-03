from collections import deque


def alien_order(words):
    adj = {c: set() for w in words for c in w}
    indeg = {c: 0 for c in adj}
    for a, b in zip(words, words[1:]):
        min_len = min(len(a), len(b))
        if len(a) > len(b) and a[:min_len] == b[:min_len]:
            return ""
        for x, y in zip(a, b):
            if x != y:
                if y not in adj[x]:
                    adj[x].add(y)
                    indeg[y] += 1
                break
    q = deque(sorted(c for c in indeg if indeg[c] == 0))
    out = []
    while q:
        c = q.popleft()
        out.append(c)
        for nx in adj[c]:
            indeg[nx] -= 1
            if indeg[nx] == 0:
                q.append(nx)
    return "".join(out) if len(out) == len(indeg) else ""
