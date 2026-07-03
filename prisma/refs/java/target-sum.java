import java.util.*;

class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        Map<Integer, Integer> counts = new HashMap<>();
        counts.put(0, 1);
        for (int n : nums) {
            Map<Integer, Integer> next = new HashMap<>();
            for (Map.Entry<Integer, Integer> e : counts.entrySet()) {
                next.merge(e.getKey() + n, e.getValue(), Integer::sum);
                next.merge(e.getKey() - n, e.getValue(), Integer::sum);
            }
            counts = next;
        }
        return counts.getOrDefault(target, 0);
    }
}
