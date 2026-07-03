import java.util.*;

class Solution {
    public List<String> findItinerary(List<List<String>> tickets) {
        Map<String, PriorityQueue<String>> adj = new HashMap<>();
        for (List<String> t : tickets)
            adj.computeIfAbsent(t.get(0), k -> new PriorityQueue<>()).add(t.get(1));
        List<String> out = new ArrayList<>();
        Deque<String> stack = new ArrayDeque<>();
        stack.push("JFK");
        while (!stack.isEmpty()) {
            String cur = stack.peek();
            PriorityQueue<String> dests = adj.get(cur);
            if (dests != null && !dests.isEmpty()) stack.push(dests.poll());
            else out.add(stack.pop());
        }
        Collections.reverse(out);
        return out;
    }
}
