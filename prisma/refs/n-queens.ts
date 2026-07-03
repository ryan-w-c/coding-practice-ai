export function solveNQueens(n: number): string[][] {
  const res: string[][] = [];
  const cols = new Set<number>(), d1 = new Set<number>(), d2 = new Set<number>();
  const board: number[] = [];
  const bt = (r: number) => {
    if (r === n) {
      res.push(board.map((c) => ".".repeat(c) + "Q" + ".".repeat(n - c - 1)));
      return;
    }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || d1.has(r - c) || d2.has(r + c)) continue;
      cols.add(c); d1.add(r - c); d2.add(r + c); board.push(c);
      bt(r + 1);
      cols.delete(c); d1.delete(r - c); d2.delete(r + c); board.pop();
    }
  };
  bt(0);
  return res;
}
