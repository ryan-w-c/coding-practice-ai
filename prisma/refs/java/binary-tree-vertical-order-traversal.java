import java.util.*;

class Solution {
    public List<List<Integer>> verticalOrder(TreeNode root) {
        List<List<Integer>> out = new ArrayList<>();
        if (root == null) return out;
        Map<Integer, List<Integer>> cols = new HashMap<>();
        Deque<TreeNode> nodes = new ArrayDeque<>();
        Deque<Integer> colq = new ArrayDeque<>();
        nodes.add(root);
        colq.add(0);
        int lo = 0, hi = 0;
        while (!nodes.isEmpty()) {
            TreeNode n = nodes.poll();
            int c = colq.poll();
            cols.computeIfAbsent(c, k -> new ArrayList<>()).add(n.val);
            lo = Math.min(lo, c);
            hi = Math.max(hi, c);
            if (n.left != null) { nodes.add(n.left); colq.add(c - 1); }
            if (n.right != null) { nodes.add(n.right); colq.add(c + 1); }
        }
        for (int c = lo; c <= hi; c++) out.add(cols.get(c));
        return out;
    }
}
