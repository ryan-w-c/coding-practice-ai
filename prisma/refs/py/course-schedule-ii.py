from collections import deque


def find_order(num_courses, prerequisites):
    indeg = [0] * num_courses
    adj = [[] for _ in range(num_courses)]
    for a, b in prerequisites:
        adj[b].append(a)
        indeg[a] += 1
    q = deque(i for i in range(num_courses) if indeg[i] == 0)
    out = []
    while q:
        c = q.popleft()
        out.append(c)
        for nx in adj[c]:
            indeg[nx] -= 1
            if indeg[nx] == 0:
                q.append(nx)
    return out if len(out) == num_courses else []
