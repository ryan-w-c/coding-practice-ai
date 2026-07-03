/**
 * Partition Labels - Medium
 *
 * https://leetcode.com/problems/partition-labels/
 */

export function partitionLabels(s: string): number[] {
  const last = new Map<string, number>();
  for (let i = 0; i < s.length; i++) last.set(s[i], i);
  const out: number[] = [];
  let start = 0, end = 0;
  for (let i = 0; i < s.length; i++) {
    end = Math.max(end, last.get(s[i])!);
    if (i === end) {
      out.push(i - start + 1);
      start = i + 1;
    }
  }
  return out;
}
