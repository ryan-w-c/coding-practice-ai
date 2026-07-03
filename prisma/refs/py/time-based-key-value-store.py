import bisect
from collections import defaultdict


class TimeMap:
    def __init__(self):
        self.store = defaultdict(list)  # key -> [(timestamp, value)]

    def set(self, key, value, timestamp):
        self.store[key].append((timestamp, value))

    def get(self, key, timestamp):
        arr = self.store.get(key, [])
        i = bisect.bisect_right(arr, (timestamp, chr(0x10FFFF)))
        return arr[i - 1][1] if i else ""
