import java.util.*;

class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int n : nums) freq.merge(n, 1, Integer::sum);
        return freq.entrySet().stream()
            .sorted((a, b) -> b.getValue() - a.getValue())
            .limit(k)
            .mapToInt(Map.Entry::getKey)
            .toArray();
    }
}
