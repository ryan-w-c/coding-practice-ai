class Solution {
    public int[] countBits(int n) {
        int[] out = new int[n + 1];
        for (int i = 1; i <= n; i++) out[i] = out[i >> 1] + (i & 1);
        return out;
    }
}
