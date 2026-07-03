import java.util.*;

class Solution {
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        int[] indeg = new int[numCourses];
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        for (int[] p : prerequisites) {
            adj.get(p[1]).add(p[0]);
            indeg[p[0]]++;
        }
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++) if (indeg[i] == 0) q.add(i);
        int[] out = new int[numCourses];
        int k = 0;
        while (!q.isEmpty()) {
            int c = q.poll();
            out[k++] = c;
            for (int nx : adj.get(c)) if (--indeg[nx] == 0) q.add(nx);
        }
        return k == numCourses ? out : new int[0];
    }
}
