/**
 * Find Median in a Data Stream - Hard
 *
 * https://leetcode.com/problems/find-median-from-data-stream/
 */

export class MedianFinder {
  private nums: number[] = []; // kept sorted

  addNum(num: number): void {
    let lo = 0, hi = this.nums.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.nums[mid] < num) lo = mid + 1;
      else hi = mid;
    }
    this.nums.splice(lo, 0, num);
  }

  findMedian(): number {
    const n = this.nums.length;
    return n % 2 === 1 ? this.nums[n >> 1] : (this.nums[n / 2 - 1] + this.nums[n / 2]) / 2;
  }
}
