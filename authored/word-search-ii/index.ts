/**
 * Word Search II - Hard
 *
 * https://leetcode.com/problems/word-search-ii/
 */

type Node = { children: Map<string, Node>; word: string | null };

export function findWords(board: string[][], words: string[]): string[] {
  const root: Node = { children: new Map(), word: null };
  for (const w of words) {
    let node = root;
    for (const c of w) {
      if (!node.children.has(c)) node.children.set(c, { children: new Map(), word: null });
      node = node.children.get(c)!;
    }
    node.word = w;
  }

  const m = board.length, n = board[0].length;
  const out: string[] = [];
  const dfs = (r: number, c: number, node: Node) => {
    const ch = board[r][c];
    const next = node.children.get(ch);
    if (!next) return;
    if (next.word !== null) {
      out.push(next.word);
      next.word = null; // dedupe
    }
    board[r][c] = "#";
    if (r > 0 && board[r - 1][c] !== "#") dfs(r - 1, c, next);
    if (r < m - 1 && board[r + 1][c] !== "#") dfs(r + 1, c, next);
    if (c > 0 && board[r][c - 1] !== "#") dfs(r, c - 1, next);
    if (c < n - 1 && board[r][c + 1] !== "#") dfs(r, c + 1, next);
    board[r][c] = ch;
  };
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) dfs(r, c, root);
  return out;
}
