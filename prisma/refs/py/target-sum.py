from collections import defaultdict


def find_target_sum_ways(nums, target):
    counts = {0: 1}
    for n in nums:
        nxt = defaultdict(int)
        for s, ways in counts.items():
            nxt[s + n] += ways
            nxt[s - n] += ways
        counts = nxt
    return counts.get(target, 0)
