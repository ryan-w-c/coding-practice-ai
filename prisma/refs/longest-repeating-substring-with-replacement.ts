export function characterReplacement(s: string, k: number): number {
  const count = new Array<number>(26).fill(0);
  const A = "A".charCodeAt(0);
  let l = 0, maxFreq = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    maxFreq = Math.max(maxFreq, ++count[s.charCodeAt(r) - A]);
    while (r - l + 1 - maxFreq > k) {
      count[s.charCodeAt(l) - A]--;
      l++;
    }
    best = Math.max(best, r - l + 1);
  }
  return best;
}
