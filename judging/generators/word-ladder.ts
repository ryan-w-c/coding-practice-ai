import type { Rng } from "./_rng";
import { word } from "./_shared";

function wordSet(rng: Rng, n: number, len: number, alpha: string): string[] {
  const set = new Set<string>();
  let guard = 0;
  while (set.size < n && guard++ < n * 30) set.add(word(rng, len, len, alpha));
  return [...set];
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const len = rng.int(2, 4);
    const list = wordSet(rng, rng.int(3, 60), len, "abc"); // dense neighborhoods
    const begin = word(rng, len, len, "abc");
    const end = rng.next() < 0.7 ? rng.pick(list) : word(rng, len, len, "abc");
    out.push({ name: `random #${i} (len=${len}, ${list.length} words)`, args: [begin, end, list] });
  }
  return out;
}

export function stress(rng: Rng) {
  const list = wordSet(rng, 4000, 5, "abcde");
  return [{ name: "4000 five-letter words", args: [list[0], list[list.length - 1], list] }];
}

// BFS over an explicitly built diff-by-one graph
export function brute(beginWord: string, endWord: string, wordList: string[]): number {
  if (!wordList.includes(endWord)) return 0;
  const words = [beginWord, ...wordList.filter((w) => w !== beginWord)];
  const diff1 = (a: string, b: string) => {
    let d = 0;
    for (let i = 0; i < a.length && d < 2; i++) if (a[i] !== b[i]) d++;
    return d === 1;
  };
  const dist = new Map([[beginWord, 1]]);
  const queue = [beginWord];
  while (queue.length) {
    const w = queue.shift()!;
    if (w === endWord) return dist.get(w)!;
    for (const v of words) {
      if (!dist.has(v) && diff1(w, v)) {
        dist.set(v, dist.get(w)! + 1);
        queue.push(v);
      }
    }
  }
  return 0;
}
