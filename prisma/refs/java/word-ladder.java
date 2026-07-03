import java.util.*;

class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> words = new HashSet<>(wordList);
        if (!words.contains(endWord)) return 0;
        Set<String> frontier = new HashSet<>(Collections.singletonList(beginWord));
        int steps = 1;
        while (!frontier.isEmpty()) {
            Set<String> next = new HashSet<>();
            for (String w : frontier) {
                if (w.equals(endWord)) return steps;
                char[] chars = w.toCharArray();
                for (int i = 0; i < chars.length; i++) {
                    char orig = chars[i];
                    for (char c = 'a'; c <= 'z'; c++) {
                        chars[i] = c;
                        String cand = new String(chars);
                        if (words.remove(cand)) next.add(cand);
                    }
                    chars[i] = orig;
                }
            }
            frontier = next;
            steps++;
        }
        return 0;
    }
}
