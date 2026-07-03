export function combinationSum2(candidates: number[], target: number): number[][] {
  const nums = [...candidates].sort((a, b) => a - b);
  const res: number[][] = [];
  const cur: number[] = [];
  const bt = (start: number, rem: number) => {
    if (rem === 0) {
      res.push([...cur]);
      return;
    }
    for (let i = start; i < nums.length && nums[i] <= rem; i++) {
      if (i > start && nums[i] === nums[i - 1]) continue;
      cur.push(nums[i]);
      bt(i + 1, rem - nums[i]);
      cur.pop();
    }
  };
  bt(0, target);
  return res;
}
