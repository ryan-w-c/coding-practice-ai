export function combinationSum(nums: number[], target: number): number[][] {
  const res: number[][] = [];
  const cur: number[] = [];
  const bt = (start: number, rem: number) => {
    if (rem === 0) {
      res.push([...cur]);
      return;
    }
    if (rem < 0) return;
    for (let i = start; i < nums.length; i++) {
      cur.push(nums[i]);
      bt(i, rem - nums[i]);
      cur.pop();
    }
  };
  bt(0, target);
  return res;
}
