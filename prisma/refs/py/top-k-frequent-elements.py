from collections import Counter


def top_k_frequent(nums, k):
    return [v for v, _ in Counter(nums).most_common(k)]
