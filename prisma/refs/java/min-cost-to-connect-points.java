import java.util.*;

class Solution {
    public int minCostConnectPoints(int[][] points) {
        int n = points.length;
        int[] dist = new int[n];
        boolean[] inTree = new boolean[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[0] = 0;
        int total = 0;
        for (int step = 0; step < n; step++) {
            int u = -1;
            for (int i = 0; i < n; i++)
                if (!inTree[i] && (u == -1 || dist[i] < dist[u])) u = i;
            inTree[u] = true;
            total += dist[u];
            for (int v = 0; v < n; v++) {
                if (inTree[v]) continue;
                int d = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);
                if (d < dist[v]) dist[v] = d;
            }
        }
        return total;
    }
}
