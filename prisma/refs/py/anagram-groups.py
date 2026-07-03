from collections import defaultdict


def group_anagrams(strs):
    groups = defaultdict(list)
    for s in strs:
        groups["".join(sorted(s))].append(s)
    return list(groups.values())
