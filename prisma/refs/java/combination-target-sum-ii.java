import java.util.*;

class Solution {
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        int[] nums = candidates.clone();
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        bt(nums, 0, target, new ArrayList<>(), res);
        return res;
    }

    private void bt(int[] nums, int start, int rem, List<Integer> cur, List<List<Integer>> res) {
        if (rem == 0) {
            res.add(new ArrayList<>(cur));
            return;
        }
        for (int i = start; i < nums.length && nums[i] <= rem; i++) {
            if (i > start && nums[i] == nums[i - 1]) continue;
            cur.add(nums[i]);
            bt(nums, i + 1, rem - nums[i], cur, res);
            cur.remove(cur.size() - 1);
        }
    }
}
