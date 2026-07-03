import type { Rng } from "./_rng";
import { word } from "./_shared";

function randomBoard(rng: Rng, m: number, n: number): string[][] {
  return Array.from({ length: m }, () => Array.from({ length: n }, () => rng.pick([..."abcde"])));
}

// read a word along a random self-avoiding walk (guaranteed present)
function walkWord(rng: Rng, b: string[][], len: number): string {
  const m = b.length, n = b[0].length;
  let r = rng.int(0, m - 1), c = rng.int(0, n - 1);
  const used = new Set([r * n + c]);
  let w = b[r][c];
  for (let i = 1; i < len; i++) {
    const opts = ([[1, 0], [-1, 0], [0, 1], [0, -1]] as const)
      .map(([dr, dc]) => [r + dr, c + dc] as [number, number])
      .filter(([nr, nc]) => nr >= 0 && nr < m && nc >= 0 && nc < n && !used.has(nr * n + nc));
    if (!opts.length) break;
    [r, c] = rng.pick(opts);
    used.add(r * n + c);
    w += b[r][c];
  }
  return w;
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const m = rng.int(1, 6), n = rng.int(1, 6);
    const b = randomBoard(rng, m, n);
    const words = new Set<string>();
    for (let k = rng.int(1, 6); k > 0; k--) words.add(walkWord(rng, b, rng.int(1, 7)));
    for (let k = rng.int(1, 6); k > 0; k--) words.add(word(rng, 1, 7, "abcde"));
    out.push({ name: `random #${i} (${m}x${n}, ${words.size} words)`, args: [b, [...words]] });
  }
  return out;
}

export function stress(rng: Rng) {
  const b = randomBoard(rng, 10, 10);
  const words = new Set<string>();
  for (let k = 0; k < 200; k++) words.add(walkWord(rng, b, rng.int(3, 9)));
  for (let k = 0; k < 800; k++) words.add(word(rng, 3, 9, "abcde"));
  return [{ name: `10x10 board, ${words.size} words`, args: [b, [...words]] }];
}

// per-word DFS existence check (no trie)
export function brute(b: string[][], words: string[]): string[] {
  const m = b.length, n = b[0].length;
  const exists = (w: string): boolean => {
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
  };
  return words.filter(exists);
}
