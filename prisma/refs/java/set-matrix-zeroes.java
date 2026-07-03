import java.util.*;

class Solution {
    public void setZeroes(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        Set<Integer> rows = new HashSet<>(), cols = new HashSet<>();
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                if (matrix[r][c] == 0) { rows.add(r); cols.add(c); }
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                if (rows.contains(r) || cols.contains(c)) matrix[r][c] = 0;
    }
}
