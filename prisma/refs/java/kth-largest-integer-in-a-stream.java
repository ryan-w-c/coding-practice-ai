import java.util.*;

class KthLargest {
    private final int k;
    private final PriorityQueue<Integer> heap = new PriorityQueue<>();

    public KthLargest(int k, int[] nums) {
        this.k = k;
        for (int n : nums) add(n);
    }

    public int add(int val) {
        heap.add(val);
        if (heap.size() > k) heap.poll();
        return heap.peek();
    }
}
