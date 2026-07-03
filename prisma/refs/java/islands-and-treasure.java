import java.util.*;

class Solution {
    public void fillLandWithDistanceToTreasure(int[][] grid) {
        int INF = 2147483647;
        int m = grid.length, n = grid[0].length;
        Deque<int[]> q = new ArrayDeque<>();
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++) if (grid[r][c] == 0) q.add(new int[]{r, c});
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!q.isEmpty()) {
            int[] cell = q.poll();
            for (int[] d : dirs) {
                int nr = cell[0] + d[0], nc = cell[1] + d[1];
                if (nr < 0 || nr >= m || nc < 0 || nc >= n || grid[nr][nc] != INF) continue;
                grid[nr][nc] = grid[cell[0]][cell[1]] + 1;
                q.add(new int[]{nr, nc});
            }
        }
    }
}
