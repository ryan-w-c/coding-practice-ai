import heapq


def min_interval(intervals, queries):
    ivs = sorted(intervals)
    out = [-1] * len(queries)
    heap = []  # (size, right)
    idx = 0
    for q, qi in sorted((q, i) for i, q in enumerate(queries)):
        while idx < len(ivs) and ivs[idx][0] <= q:
            l, r = ivs[idx]
            heapq.heappush(heap, (r - l + 1, r))
            idx += 1
        while heap and heap[0][1] < q:
            heapq.heappop(heap)
        if heap:
            out[qi] = heap[0][0]
    return out
