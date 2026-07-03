export function solve(board: string[][]): void {
  const m = board.length, n = board[0]?.length ?? 0;
  const mark = (r: number, c: number) => {
    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== "O") return;
    board[r][c] = "S";
    mark(r + 1, c);
    mark(r - 1, c);
    mark(r, c + 1);
    mark(r, c - 1);
  };
  for (let r = 0; r < m; r++) {
    mark(r, 0);
    mark(r, n - 1);
  }
  for (let c = 0; c < n; c++) {
    mark(0, c);
    mark(m - 1, c);
  }
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++) board[r][c] = board[r][c] === "S" ? "O" : "X";
}
