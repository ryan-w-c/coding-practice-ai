class Solution {
    public String multiply(String num1, String num2) {
        if (num1.equals("0") || num2.equals("0")) return "0";
        int m = num1.length(), n = num2.length();
        int[] acc = new int[m + n];
        for (int i = m - 1; i >= 0; i--)
            for (int j = n - 1; j >= 0; j--) {
                int prod = (num1.charAt(i) - '0') * (num2.charAt(j) - '0') + acc[i + j + 1];
                acc[i + j + 1] = prod % 10;
                acc[i + j] += prod / 10;
            }
        StringBuilder b = new StringBuilder();
        for (int d : acc) if (!(b.length() == 0 && d == 0)) b.append(d);
        return b.toString();
    }
}
