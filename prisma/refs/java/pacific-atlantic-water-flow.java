import java.util.*;

class Solution {
    private int m, n;
    private int[][] h;

    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        h = heights;
        m = heights.length;
        n = heights[0].length;
        boolean[][] pac = new boolean[m][n], atl = new boolean[m][n];
        for (int r = 0; r < m; r++) {
            dfs(r, 0, pac);
            dfs(r, n - 1, atl);
        }
        for (int c = 0; c < n; c++) {
            dfs(0, c, pac);
            dfs(m - 1, c, atl);
        }
        List<List<Integer>> out = new ArrayList<>();
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                if (pac[r][c] && atl[r][c]) out.add(Arrays.asList(r, c));
        return out;
    }

    private void dfs(int r, int c, boolean[][] seen) {
        seen[r][c] = true;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
            if (seen[nr][nc] || h[nr][nc] < h[r][c]) continue;
            dfs(nr, nc, seen);
        }
    }
}
