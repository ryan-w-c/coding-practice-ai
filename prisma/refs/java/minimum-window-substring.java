import java.util.*;

class Solution {
    public String minWindow(String s, String t) {
        if (t.length() > s.length()) return "";
        Map<Character, Integer> need = new HashMap<>();
        for (char c : t.toCharArray()) need.merge(c, 1, Integer::sum);
        Map<Character, Integer> window = new HashMap<>();
        int have = 0, required = need.size();
        int bestL = -1, bestR = -1, l = 0;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            window.merge(c, 1, Integer::sum);
            if (need.containsKey(c) && window.get(c).equals(need.get(c))) have++;
            while (have == required) {
                if (bestL == -1 || r - l < bestR - bestL) { bestL = l; bestR = r; }
                char lc = s.charAt(l);
                window.merge(lc, -1, Integer::sum);
                if (need.containsKey(lc) && window.get(lc) < need.get(lc)) have--;
                l++;
            }
        }
        return bestL == -1 ? "" : s.substring(bestL, bestR + 1);
    }
}
