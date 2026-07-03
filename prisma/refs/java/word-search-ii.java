import java.util.*;

class Solution {
    private static class Node {
        Node[] children = new Node[26];
        String word;
    }

    public List<String> findWords(char[][] board, String[] words) {
        Node root = new Node();
        for (String w : words) {
            Node node = root;
            for (char c : w.toCharArray()) {
                if (node.children[c - 'a'] == null) node.children[c - 'a'] = new Node();
                node = node.children[c - 'a'];
            }
            node.word = w;
        }
        List<String> out = new ArrayList<>();
        for (int r = 0; r < board.length; r++)
            for (int c = 0; c < board[0].length; c++)
                dfs(board, r, c, root, out);
        return out;
    }

    private void dfs(char[][] board, int r, int c, Node node, List<String> out) {
        char ch = board[r][c];
        if (ch == '#' || node.children[ch - 'a'] == null) return;
        Node next = node.children[ch - 'a'];
        if (next.word != null) {
            out.add(next.word);
            next.word = null;
        }
        board[r][c] = '#';
        if (r > 0) dfs(board, r - 1, c, next, out);
        if (r < board.length - 1) dfs(board, r + 1, c, next, out);
        if (c > 0) dfs(board, r, c - 1, next, out);
        if (c < board[0].length - 1) dfs(board, r, c + 1, next, out);
        board[r][c] = ch;
    }
}
