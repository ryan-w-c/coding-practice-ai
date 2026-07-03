import java.util.*;

class DetectSquares {
    private final Map<Long, Integer> counts = new HashMap<>();
    private final List<int[]> points = new ArrayList<>();

    public DetectSquares() {}

    private long key(int x, int y) { return (long) x * 100_000 + y; }

    public void add(int[] point) {
        counts.merge(key(point[0], point[1]), 1, Integer::sum);
        points.add(point.clone());
    }

    public int count(int[] point) {
        int qx = point[0], qy = point[1], total = 0;
        for (int[] p : points) {
            int x = p[0], y = p[1];
            if (Math.abs(x - qx) != Math.abs(y - qy) || x == qx) continue;
            total += counts.getOrDefault(key(x, qy), 0) * counts.getOrDefault(key(qx, y), 0);
        }
        return total;
    }
}
