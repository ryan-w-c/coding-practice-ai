/**
 * Largest Rectangle in Histogram - Hard
 *
 * https://leetcode.com/problems/largest-rectangle-in-histogram/
 */

export function largestRectangleArea(heights: number[]): number {
  const stack: number[] = []; // indices with increasing heights
  let best = 0;
  for (let i = 0; i <= heights.length; i++) {
    const h = i === heights.length ? 0 : heights[i];
    while (stack.length && heights[stack[stack.length - 1]] >= h) {
      const top = stack.pop()!;
      const left = stack.length ? stack[stack.length - 1] + 1 : 0;
      best = Math.max(best, heights[top] * (i - left));
    }
    stack.push(i);
  }
  return best;
}
