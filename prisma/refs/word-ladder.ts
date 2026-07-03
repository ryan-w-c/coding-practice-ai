export function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
  const words = new Set(wordList);
  if (!words.has(endWord)) return 0;
  let frontier = new Set([beginWord]);
  let steps = 1;
  const alpha = "abcdefghijklmnopqrstuvwxyz";
  while (frontier.size) {
    const next = new Set<string>();
    for (const w of frontier) {
      if (w === endWord) return steps;
      for (let i = 0; i < w.length; i++) {
        for (const c of alpha) {
          const cand = w.slice(0, i) + c + w.slice(i + 1);
          if (words.has(cand)) {
            words.delete(cand);
            next.add(cand);
          }
        }
      }
    }
    frontier = next;
    steps++;
  }
  return 0;
}
