export function threeSum(nums: number[]): number[][] {
  const a = [...nums].sort((x, y) => x - y);
  const res: number[][] = [];
  for (let i = 0; i < a.length - 2; i++) {
    if (i > 0 && a[i] === a[i - 1]) continue;
    if (a[i] > 0) break;
    let l = i + 1, r = a.length - 1;
    while (l < r) {
      const sum = a[i] + a[l] + a[r];
      if (sum < 0) l++;
      else if (sum > 0) r--;
      else {
        res.push([a[i], a[l], a[r]]);
        while (l < r && a[l] === a[l + 1]) l++;
        while (l < r && a[r] === a[r - 1]) r--;
        l++;
        r--;
      }
    }
  }
  return res;
}
