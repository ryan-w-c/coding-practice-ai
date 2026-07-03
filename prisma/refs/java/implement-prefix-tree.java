class Trie {
    private static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean end;
    }

    private final TrieNode root = new TrieNode();

    public Trie() {}

    public void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            if (node.children[c - 'a'] == null) node.children[c - 'a'] = new TrieNode();
            node = node.children[c - 'a'];
        }
        node.end = true;
    }

    private TrieNode walk(String s) {
        TrieNode node = root;
        for (char c : s.toCharArray()) {
            node = node.children[c - 'a'];
            if (node == null) return null;
        }
        return node;
    }

    public boolean search(String word) {
        TrieNode node = walk(word);
        return node != null && node.end;
    }

    public boolean startsWith(String prefix) {
        return walk(prefix) != null;
    }
}
