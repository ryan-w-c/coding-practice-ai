export function rob(nums: number[]): number {
  if (nums.length === 1) return nums[0];
  const linear = (arr: number[]): number => {
    let take = 0, skip = 0;
    for (const n of arr) [take, skip] = [skip + n, Math.max(take, skip)];
    return Math.max(take, skip);
  };
  return Math.max(linear(nums.slice(1)), linear(nums.slice(0, -1)));
}
