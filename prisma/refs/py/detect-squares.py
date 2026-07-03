from collections import Counter


class DetectSquares:
    def __init__(self):
        self.counts = Counter()
        self.points = []

    def add(self, point):
        x, y = point
        self.counts[(x, y)] += 1
        self.points.append((x, y))

    def count(self, point):
        qx, qy = point
        total = 0
        for x, y in self.points:
            if abs(x - qx) != abs(y - qy) or x == qx:
                continue
            total += self.counts[(x, qy)] * self.counts[(qx, y)]
        return total
