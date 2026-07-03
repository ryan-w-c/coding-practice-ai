class Solution {
    public String longestPalindrome(String s) {
        int start = 0, len = 0;
        for (int i = 0; i < s.length(); i++) {
            for (int j = 0; j <= 1; j++) {
                int l = i, r = i + j;
                while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
                    l--;
                    r++;
                }
                if (r - l - 1 > len) {
                    len = r - l - 1;
                    start = l + 1;
                }
            }
        }
        return s.substring(start, start + len);
    }
}
