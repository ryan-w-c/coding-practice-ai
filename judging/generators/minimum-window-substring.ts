import type { Rng } from "./_rng";
import { word } from "./_shared";

// every minimal-length valid window's text, via two pointers
function minimalWindows(s: string, t: string): string[] {
  if (!t.length || t.length > s.length) return [];
  const need = new Map<string, number>();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);
  const win = new Map<string, number>();
  let have = 0, best = Infinity;
  const found: [number, number][] = [];
  let l = 0;
  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    win.set(c, (win.get(c) ?? 0) + 1);
    if (need.has(c) && win.get(c) === need.get(c)) have++;
    while (have === need.size) {
      if (r - l + 1 < best) {
        best = r - l + 1;
        found.length = 0;
      }
      if (r - l + 1 === best) found.push([l, r]);
      const lc = s[l];
      win.set(lc, win.get(lc)! - 1);
      if (need.has(lc) && win.get(lc)! < need.get(lc)!) have--;
      l++;
    }
  }
  return [...new Set(found.map(([a, b]) => s.slice(a, b + 1)))];
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  let guard = 0;
  while (out.length < 12 && guard++ < 600) {
    const s = word(rng, 5, 120, "abcdef");
    const t = word(rng, 1, 6, "abcdef");
    const wins = minimalWindows(s, t);
    if (wins.length > 1) continue; // LC guarantees the answer is unique
    out.push({ name: `random unique #${out.length}`, args: [s, t] });
  }
  return out;
}

export function stress(rng: Rng) {
  // rare anchor char keeps the minimal window unique in practice; verify anyway
  for (let tries = 0; tries < 100; tries++) {
    const body = word(rng, 20_000, 20_000, "abcdef");
    const at = rng.int(5000, 15_000);
    const s = body.slice(0, at) + "z" + body.slice(at);
    const t = "z" + word(rng, 3, 3, "abcdef");
    if (minimalWindows(s, t).length === 1) {
      return [{ name: "n=20000 unique anchored window", args: [s, t] }];
    }
  }
  return [];
}

export function brute(s: string, t: string): string {
  return minimalWindows(s, t)[0] ?? "";
}
