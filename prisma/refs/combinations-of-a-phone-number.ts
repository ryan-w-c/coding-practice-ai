export function letterCombinations(digits: string): string[] {
  if (!digits.length) return [];
  const map: Record<string, string> = {
    "2": "abc", "3": "def", "4": "ghi", "5": "jkl",
    "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz",
  };
  let res = [""];
  for (const d of digits) {
    const next: string[] = [];
    for (const p of res) for (const c of map[d]) next.push(p + c);
    res = next;
  }
  return res;
}
