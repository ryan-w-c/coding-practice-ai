/**
 * Median of Two Sorted Arrays - Hard
 *
 * https://leetcode.com/problems/median-of-two-sorted-arrays/
 */

export function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  let [a, b] = nums1.length <= nums2.length ? [nums1, nums2] : [nums2, nums1];
  const m = a.length, n = b.length;
  const half = (m + n + 1) >> 1;
  let lo = 0, hi = m;
  while (lo <= hi) {
    const i = (lo + hi) >> 1; // take i from a
    const j = half - i;
    const aLeft = i > 0 ? a[i - 1] : -Infinity;
    const aRight = i < m ? a[i] : Infinity;
    const bLeft = j > 0 ? b[j - 1] : -Infinity;
    const bRight = j < n ? b[j] : Infinity;
    if (aLeft <= bRight && bLeft <= aRight) {
      const leftMax = Math.max(aLeft, bLeft);
      if ((m + n) % 2 === 1) return leftMax;
      return (leftMax + Math.min(aRight, bRight)) / 2;
    }
    if (aLeft > bRight) hi = i - 1;
    else lo = i + 1;
  }
  return 0;
}
