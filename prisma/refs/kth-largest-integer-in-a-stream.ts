export class KthLargest {
  private k: number;
  private nums: number[] = []; // ascending, at most k elements (the k largest)

  constructor(k: number, nums: number[]) {
    this.k = k;
    for (const n of nums) this.add(n);
  }

  add(val: number): number {
    let lo = 0, hi = this.nums.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.nums[mid] < val) lo = mid + 1;
      else hi = mid;
    }
    this.nums.splice(lo, 0, val);
    if (this.nums.length > this.k) this.nums.shift();
    return this.nums[0];
  }
}
