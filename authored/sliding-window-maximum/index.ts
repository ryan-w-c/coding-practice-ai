/**
 * Sliding Window Maximum - Hard
 *
 * https://leetcode.com/problems/sliding-window-maximum/
 */

export function maxSlidingWindow(nums: number[], k: number): number[] {
  const out: number[] = [];
  const deque: number[] = []; // indices, values decreasing
  for (let i = 0; i < nums.length; i++) {
    while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) deque.pop();
    deque.push(i);
    if (deque[0] <= i - k) deque.shift();
    if (i >= k - 1) out.push(nums[deque[0]]);
  }
  return out;
}
