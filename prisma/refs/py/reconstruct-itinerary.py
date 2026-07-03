from collections import defaultdict


def find_itinerary(tickets):
    adj = defaultdict(list)
    for f, t in tickets:
        adj[f].append(t)
    for dests in adj.values():
        dests.sort(reverse=True)  # pop() gives smallest
    out, stack = [], ["JFK"]
    while stack:
        cur = stack[-1]
        if adj[cur]:
            stack.append(adj[cur].pop())
        else:
            out.append(stack.pop())
    return out[::-1]
