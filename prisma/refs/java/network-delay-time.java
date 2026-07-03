import java.util.*;

class Solution {
    public int networkDelayTime(int[][] times, int n, int k) {
        Map<Integer, List<int[]>> adj = new HashMap<>();
        for (int[] t : times) adj.computeIfAbsent(t[0], x -> new ArrayList<>()).add(new int[]{t[1], t[2]});
        Map<Integer, Integer> dist = new HashMap<>();
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        heap.add(new int[]{0, k});
        while (!heap.isEmpty()) {
            int[] top = heap.poll();
            if (dist.containsKey(top[1])) continue;
            dist.put(top[1], top[0]);
            for (int[] e : adj.getOrDefault(top[1], Collections.emptyList()))
                if (!dist.containsKey(e[0])) heap.add(new int[]{top[0] + e[1], e[0]});
        }
        if (dist.size() != n) return -1;
        int out = 0;
        for (int d : dist.values()) out = Math.max(out, d);
        return out;
    }
}
