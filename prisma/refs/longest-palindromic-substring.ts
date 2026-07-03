export function longestPalindrome(s: string): string {
  let best = "";
  const expand = (l: number, r: number) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      l--;
      r++;
    }
    if (r - l - 1 > best.length) best = s.slice(l + 1, r);
  };
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return best;
}
