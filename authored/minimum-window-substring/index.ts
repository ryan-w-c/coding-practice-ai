/**
 * Minimum Window Substring - Hard
 *
 * https://leetcode.com/problems/minimum-window-substring/
 */

export function minWindow(s: string, t: string): string {
  if (t.length > s.length) return "";
  const need = new Map<string, number>();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);
  let have = 0;
  const window = new Map<string, number>();
  let best: [number, number] | null = null;
  let l = 0;
  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    window.set(c, (window.get(c) ?? 0) + 1);
    if (need.has(c) && window.get(c) === need.get(c)) have++;
    while (have === need.size) {
      if (!best || r - l < best[1] - best[0]) best = [l, r];
      const lc = s[l];
      window.set(lc, window.get(lc)! - 1);
      if (need.has(lc) && window.get(lc)! < need.get(lc)!) have--;
      l++;
    }
  }
  return best ? s.slice(best[0], best[1] + 1) : "";
}
