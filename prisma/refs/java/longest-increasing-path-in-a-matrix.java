class Solution {
    private int[][] memo;
    private int[][] matrix;
    private int m, n;

    public int longestIncreasingPath(int[][] matrix) {
        this.matrix = matrix;
        m = matrix.length;
        n = matrix[0].length;
        memo = new int[m][n];
        int out = 0;
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++) out = Math.max(out, dfs(r, c));
        return out;
    }

    private int dfs(int r, int c) {
        if (memo[r][c] != 0) return memo[r][c];
        int best = 1;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr < 0 || nr >= m || nc < 0 || nc >= n || matrix[nr][nc] <= matrix[r][c]) continue;
            best = Math.max(best, 1 + dfs(nr, nc));
        }
        memo[r][c] = best;
        return best;
    }
}
