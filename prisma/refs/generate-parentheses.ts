export function generateParenthesis(n: number): string[] {
  const res: string[] = [];
  const bt = (cur: string, open: number, close: number) => {
    if (cur.length === 2 * n) {
      res.push(cur);
      return;
    }
    if (open < n) bt(cur + "(", open + 1, close);
    if (close < open) bt(cur + ")", open, close + 1);
  };
  bt("", 0, 0);
  return res;
}
