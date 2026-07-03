class Solution {
    public double myPow(double x, int n) {
        long exp = Math.abs((long) n);
        double base = x, out = 1;
        while (exp > 0) {
            if ((exp & 1) == 1) out *= base;
            base *= base;
            exp >>= 1;
        }
        return n < 0 ? 1 / out : out;
    }
}
