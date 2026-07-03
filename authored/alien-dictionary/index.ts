/**
 * Alien Dictionary - Hard
 *
 * https://leetcode.com/problems/alien-dictionary/
 */

export function alienOrder(words: string[]): string {
  const adj = new Map<string, Set<string>>();
  const indeg = new Map<string, number>();
  for (const w of words) for (const c of w) {
    if (!adj.has(c)) adj.set(c, new Set());
    if (!indeg.has(c)) indeg.set(c, 0);
  }
  for (let i = 0; i + 1 < words.length; i++) {
    const a = words[i], b = words[i + 1];
    const minLen = Math.min(a.length, b.length);
    if (a.length > b.length && a.slice(0, minLen) === b.slice(0, minLen)) return ""; // prefix violation
    for (let j = 0; j < minLen; j++) {
      if (a[j] !== b[j]) {
        if (!adj.get(a[j])!.has(b[j])) {
          adj.get(a[j])!.add(b[j]);
          indeg.set(b[j], indeg.get(b[j])! + 1);
        }
        break;
      }
    }
  }
  const queue = [...indeg.keys()].filter((c) => indeg.get(c) === 0).sort();
  const out: string[] = [];
  while (queue.length) {
    const c = queue.shift()!;
    out.push(c);
    for (const nx of adj.get(c)!) {
      indeg.set(nx, indeg.get(nx)! - 1);
      if (indeg.get(nx) === 0) queue.push(nx);
    }
  }
  return out.length === indeg.size ? out.join("") : "";
}
