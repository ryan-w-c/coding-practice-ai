class Solution {
    public int singleNumber(int[] nums) {
        int acc = 0;
        for (int n : nums) acc ^= n;
        return acc;
    }
}
