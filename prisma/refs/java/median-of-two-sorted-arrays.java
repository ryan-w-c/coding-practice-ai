class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        int[] a = nums1.length <= nums2.length ? nums1 : nums2;
        int[] b = nums1.length <= nums2.length ? nums2 : nums1;
        int m = a.length, n = b.length, half = (m + n + 1) / 2;
        int lo = 0, hi = m;
        while (lo <= hi) {
            int i = (lo + hi) / 2, j = half - i;
            long aLeft = i > 0 ? a[i - 1] : Long.MIN_VALUE;
            long aRight = i < m ? a[i] : Long.MAX_VALUE;
            long bLeft = j > 0 ? b[j - 1] : Long.MIN_VALUE;
            long bRight = j < n ? b[j] : Long.MAX_VALUE;
            if (aLeft <= bRight && bLeft <= aRight) {
                long leftMax = Math.max(aLeft, bLeft);
                if ((m + n) % 2 == 1) return leftMax;
                return (leftMax + Math.min(aRight, bRight)) / 2.0;
            }
            if (aLeft > bRight) hi = i - 1;
            else lo = i + 1;
        }
        return 0;
    }
}
