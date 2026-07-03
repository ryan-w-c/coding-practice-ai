import java.util.*;

class Solution {
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> res = new ArrayList<>();
        bt(res, new ArrayList<>(), new HashSet<>(), new HashSet<>(), new HashSet<>(), 0, n);
        return res;
    }

    private void bt(List<List<String>> res, List<Integer> board,
                    Set<Integer> cols, Set<Integer> d1, Set<Integer> d2, int r, int n) {
        if (r == n) {
            List<String> rows = new ArrayList<>();
            for (int c : board) {
                StringBuilder sb = new StringBuilder(".".repeat(n));
                sb.setCharAt(c, 'Q');
                rows.add(sb.toString());
            }
            res.add(rows);
            return;
        }
        for (int c = 0; c < n; c++) {
            if (cols.contains(c) || d1.contains(r - c) || d2.contains(r + c)) continue;
            cols.add(c); d1.add(r - c); d2.add(r + c); board.add(c);
            bt(res, board, cols, d1, d2, r + 1, n);
            cols.remove(c); d1.remove(r - c); d2.remove(r + c); board.remove(board.size() - 1);
        }
    }
}
