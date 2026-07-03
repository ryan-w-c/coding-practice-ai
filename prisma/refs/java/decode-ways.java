class Solution {
    public int numDecodings(String s) {
        if (s.charAt(0) == '0') return 0;
        int prev = 1, cur = 1;
        for (int i = 1; i < s.length(); i++) {
            int ways = 0;
            if (s.charAt(i) != '0') ways += cur;
            int two = Integer.parseInt(s.substring(i - 1, i + 1));
            if (two >= 10 && two <= 26) ways += prev;
            prev = cur;
            cur = ways;
        }
        return cur;
    }
}
