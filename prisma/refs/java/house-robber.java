class Solution {
    public int rob(int[] nums) {
        int take = 0, skip = 0;
        for (int n : nums) {
            int newTake = skip + n;
            skip = Math.max(take, skip);
            take = newTake;
        }
        return Math.max(take, skip);
    }
}
