import java.util.*;

class Solution {
    public String alienOrder(String[] words) {
        Map<Character, Set<Character>> adj = new HashMap<>();
        Map<Character, Integer> indeg = new HashMap<>();
        for (String w : words)
            for (char c : w.toCharArray()) {
                adj.putIfAbsent(c, new HashSet<>());
                indeg.putIfAbsent(c, 0);
            }
        for (int i = 0; i + 1 < words.length; i++) {
            String a = words[i], b = words[i + 1];
            int minLen = Math.min(a.length(), b.length());
            if (a.length() > b.length() && a.startsWith(b)) return "";
            for (int j = 0; j < minLen; j++) {
                char x = a.charAt(j), y = b.charAt(j);
                if (x != y) {
                    if (adj.get(x).add(y)) indeg.merge(y, 1, Integer::sum);
                    break;
                }
            }
        }
        PriorityQueue<Character> q = new PriorityQueue<>();
        for (Map.Entry<Character, Integer> e : indeg.entrySet())
            if (e.getValue() == 0) q.add(e.getKey());
        StringBuilder out = new StringBuilder();
        while (!q.isEmpty()) {
            char c = q.poll();
            out.append(c);
            for (char nx : adj.get(c))
                if (indeg.merge(nx, -1, Integer::sum) == 0) q.add(nx);
        }
        return out.length() == indeg.size() ? out.toString() : "";
    }
}
