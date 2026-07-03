import java.util.*;

class Solution {
    public boolean isNStraightHand(int[] hand, int groupSize) {
        if (hand.length % groupSize != 0) return false;
        TreeMap<Integer, Integer> count = new TreeMap<>();
        for (int c : hand) count.merge(c, 1, Integer::sum);
        for (int v : count.keySet()) {
            int need = count.get(v);
            if (need == 0) continue;
            for (int x = v; x < v + groupSize; x++) {
                int have = count.getOrDefault(x, 0);
                if (have < need) return false;
                count.put(x, have - need);
            }
        }
        return true;
    }
}
