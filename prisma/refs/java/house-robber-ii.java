class Solution {
    public int rob(int[] nums) {
        if (nums.length == 1) return nums[0];
        return Math.max(linear(nums, 1, nums.length), linear(nums, 0, nums.length - 1));
    }

    private int linear(int[] nums, int from, int to) {
        int take = 0, skip = 0;
        for (int i = from; i < to; i++) {
            int newTake = skip + nums[i];
            skip = Math.max(take, skip);
            take = newTake;
        }
        return Math.max(take, skip);
    }
}
