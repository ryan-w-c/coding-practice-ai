class WordDictionary {
    private static class Node {
        Node[] children = new Node[26];
        boolean end;
    }

    private final Node root = new Node();

    public WordDictionary() {}

    public void addWord(String word) {
        Node node = root;
        for (char c : word.toCharArray()) {
            if (node.children[c - 'a'] == null) node.children[c - 'a'] = new Node();
            node = node.children[c - 'a'];
        }
        node.end = true;
    }

    public boolean search(String word) {
        return dfs(root, word, 0);
    }

    private boolean dfs(Node node, String word, int i) {
        if (i == word.length()) return node.end;
        char c = word.charAt(i);
        if (c == '.') {
            for (Node child : node.children)
                if (child != null && dfs(child, word, i + 1)) return true;
            return false;
        }
        Node next = node.children[c - 'a'];
        return next != null && dfs(next, word, i + 1);
    }
}
