// Correct override reference (vendored index.ts is buggy). Used only to verify
// the extracted case data (docs/multi-language-judging.md).
export function subsetsWithDup(nums: number[]): number[][] {
  const s = [...nums].sort((a, b) => a - b);
  const res: number[][] = [];
  const cur: number[] = [];
  const bt = (start: number) => {
    res.push([...cur]);
    for (let i = start; i < s.length; i++) {
      if (i > start && s[i] === s[i - 1]) continue;
      cur.push(s[i]);
      bt(i + 1);
      cur.pop();
    }
  };
  bt(0);
  return res;
}
