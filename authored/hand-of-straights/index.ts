/**
 * Hand of Straights - Medium
 *
 * https://leetcode.com/problems/hand-of-straights/
 */

export function isNStraightHand(hand: number[], groupSize: number): boolean {
  if (hand.length % groupSize !== 0) return false;
  const count = new Map<number, number>();
  for (const c of hand) count.set(c, (count.get(c) ?? 0) + 1);
  const values = [...count.keys()].sort((a, b) => a - b);
  for (const v of values) {
    const need = count.get(v)!;
    if (need === 0) continue;
    for (let x = v; x < v + groupSize; x++) {
      const have = count.get(x) ?? 0;
      if (have < need) return false;
      count.set(x, have - need);
    }
  }
  return true;
}
