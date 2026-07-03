import java.util.*;

class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> res = new ArrayList<>();
        bt(res, new StringBuilder(), 0, 0, n);
        return res;
    }

    private void bt(List<String> res, StringBuilder cur, int open, int close, int n) {
        if (cur.length() == 2 * n) {
            res.add(cur.toString());
            return;
        }
        if (open < n) {
            cur.append('(');
            bt(res, cur, open + 1, close, n);
            cur.deleteCharAt(cur.length() - 1);
        }
        if (close < open) {
            cur.append(')');
            bt(res, cur, open, close + 1, n);
            cur.deleteCharAt(cur.length() - 1);
        }
    }
}
