class Solution {
    public int reverse(int x) {
        long out = 0;
        while (x != 0) {
            out = out * 10 + x % 10;
            x /= 10;
        }
        return (out < Integer.MIN_VALUE || out > Integer.MAX_VALUE) ? 0 : (int) out;
    }
}
