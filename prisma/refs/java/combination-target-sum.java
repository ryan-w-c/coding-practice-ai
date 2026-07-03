import java.util.*;

class Solution {
    public List<List<Integer>> combinationSum(int[] nums, int target) {
        List<List<Integer>> res = new ArrayList<>();
        bt(nums, 0, target, new ArrayList<>(), res);
        return res;
    }

    private void bt(int[] nums, int start, int rem, List<Integer> cur, List<List<Integer>> res) {
        if (rem == 0) {
            res.add(new ArrayList<>(cur));
            return;
        }
        if (rem < 0) return;
        for (int i = start; i < nums.length; i++) {
            cur.add(nums[i]);
            bt(nums, i, rem - nums[i], cur, res);
            cur.remove(cur.size() - 1);
        }
    }
}
