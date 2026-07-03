import java.util.*;

class Solution {
    public int[] minInterval(int[][] intervals, int[] queries) {
        int[][] ivs = intervals.clone();
        Arrays.sort(ivs, (a, b) -> a[0] - b[0]);
        Integer[] qi = new Integer[queries.length];
        for (int i = 0; i < queries.length; i++) qi[i] = i;
        Arrays.sort(qi, (a, b) -> queries[a] - queries[b]);
        int[] out = new int[queries.length];
        Arrays.fill(out, -1);
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]); // [size, right]
        int idx = 0;
        for (int i : qi) {
            int q = queries[i];
            while (idx < ivs.length && ivs[idx][0] <= q) {
                heap.add(new int[]{ivs[idx][1] - ivs[idx][0] + 1, ivs[idx][1]});
                idx++;
            }
            while (!heap.isEmpty() && heap.peek()[1] < q) heap.poll();
            if (!heap.isEmpty()) out[i] = heap.peek()[0];
        }
        return out;
    }
}
