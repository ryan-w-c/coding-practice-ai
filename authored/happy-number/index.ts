/**
 * Happy Number - Easy
 *
 * https://leetcode.com/problems/happy-number/
 */

export function isHappy(n: number): boolean {
  const next = (v: number): number => {
    let s = 0;
    while (v > 0) {
      const d = v % 10;
      s += d * d;
      v = (v / 10) | 0;
    }
    return s;
  };
  let slow = n, fast = next(n);
  while (fast !== 1 && slow !== fast) {
    slow = next(slow);
    fast = next(next(fast));
  }
  return fast === 1;
}
