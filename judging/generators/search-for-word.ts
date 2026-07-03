import type { Rng } from "./_rng";
import { word } from "./_shared";

// board of letters; optionally plant `w` along a random self-avoiding path
function board(rng: Rng, m: number, n: number, plant: string | null): string[][] {
  const b = Array.from({ length: m }, () => Array.from({ length: n }, () => rng.pick([..."abcd"])));
  if (plant) {
    let guard = 0;
    outer: while (guard++ < 200) {
      let r = rng.int(0, m - 1), c = rng.int(0, n - 1);
      const path: [number, number][] = [[r, c]];
      const used = new Set([r * n + c]);
      for (let i = 1; i < plant.length; i++) {
        const opts = ([[1, 0], [-1, 0], [0, 1], [0, -1]] as const)
          .map(([dr, dc]) => [r + dr, c + dc] as [number, number])
          .filter(([nr, nc]) => nr >= 0 && nr < m && nc >= 0 && nc < n && !used.has(nr * n + nc));
        if (!opts.length) continue outer;
        [r, c] = rng.pick(opts);
        used.add(r * n + c);
        path.push([r, c]);
      }
      path.forEach(([pr, pc], i) => { b[pr][pc] = plant[i]; });
      break;
    }
  }
  return b;
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const m = rng.int(1, 6), n = rng.int(1, 6);
    const w = word(rng, 1, Math.min(8, m * n), "abcd");
    const planted = i % 2 === 0;
    out.push({ name: `${planted ? "planted" : "random"} #${i} (${m}x${n})`, args: [board(rng, m, n, planted ? w : null), w] });
  }
  out.push({ name: "word longer than board", args: [[["a"]], "aa"] });
  out.push({ name: "revisit forbidden", args: [[["a", "b"], ["c", "a"]], "aba"] });
  return out;
}

export function stress(rng: Rng) {
  // worst-case-ish: uniform letters, absent word with matching prefix
  const b = Array.from({ length: 6 }, () => Array.from({ length: 6 }, () => "a"));
  return [{ name: "6x6 all a, word aaaaaab", args: [b, "a".repeat(8) + "b"] }];
}

export function brute(b: string[][], w: string): boolean {
  const m = b.length, n = b[0].length;
  const dfs = (r: number, c: number, i: number, used: Set<number>): boolean => {
    if (r < 0 || r >= m || c < 0 || c >= n || used.has(r * n + c) || b[r][c] !== w[i]) return false;
    if (i === w.length - 1) return true;
    used.add(r * n + c);
    const found =
      dfs(r + 1, c, i + 1, used) || dfs(r - 1, c, i + 1, used) ||
      dfs(r, c + 1, i + 1, used) || dfs(r, c - 1, i + 1, used);
    used.delete(r * n + c);
    return found;
  };
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++) if (dfs(r, c, 0, new Set())) return true;
  return false;
}
