class Solution {
    public int missingNumber(int[] nums) {
        int acc = nums.length;
        for (int i = 0; i < nums.length; i++) acc ^= i ^ nums[i];
        return acc;
    }
}
