/**
 * Merge Triplets to Form Target Triplet - Medium
 *
 * https://leetcode.com/problems/merge-triplets-to-form-target-triplet/
 */

export function mergeTriplets(triplets: number[][], target: number[]): boolean {
  const achieved = [false, false, false];
  for (const t of triplets) {
    if (t[0] > target[0] || t[1] > target[1] || t[2] > target[2]) continue;
    for (let i = 0; i < 3; i++) if (t[i] === target[i]) achieved[i] = true;
  }
  return achieved.every(Boolean);
}
