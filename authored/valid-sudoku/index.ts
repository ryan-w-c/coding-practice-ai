/**
 * Valid Sudoku - Medium
 *
 * https://leetcode.com/problems/valid-sudoku/
 */

export function isValidSudoku(board: string[][]): boolean {
  const rows = Array.from({ length: 9 }, () => new Set<string>());
  const cols = Array.from({ length: 9 }, () => new Set<string>());
  const boxes = Array.from({ length: 9 }, () => new Set<string>());
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = board[r][c];
      if (v === ".") continue;
      const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      if (rows[r].has(v) || cols[c].has(v) || boxes[b].has(v)) return false;
      rows[r].add(v);
      cols[c].add(v);
      boxes[b].add(v);
    }
  }
  return true;
}
