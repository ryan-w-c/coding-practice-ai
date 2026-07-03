import java.util.*;

class Solution {
    public int lengthOfLIS(int[] nums) {
        List<Integer> tails = new ArrayList<>();
        for (int n : nums) {
            int lo = 0, hi = tails.size();
            while (lo < hi) {
                int mid = (lo + hi) / 2;
                if (tails.get(mid) < n) lo = mid + 1;
                else hi = mid;
            }
            if (lo == tails.size()) tails.add(n);
            else tails.set(lo, n);
        }
        return tails.size();
    }
}
