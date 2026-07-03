export function isPalindrome(s: string): boolean {
  let l = 0, r = s.length - 1;
  const alnum = (c: string) => /[a-z0-9]/i.test(c);
  while (l < r) {
    while (l < r && !alnum(s[l])) l++;
    while (l < r && !alnum(s[r])) r--;
    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
    l++;
    r--;
  }
  return true;
}
