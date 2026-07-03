import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    // small jumps + zeros make both outcomes common
    out.push({ name: `random #${i}`, args: [rng.ints(rng.int(1, 150), 0, 3)] });
  }
  out.push({ name: "single element", args: [[0]] });
  return out;
}

export function stress(rng: Rng) {
  const reachable = rng.ints(100_000, 1, 4);
  const blocked = rng.ints(100_000, 0, 2);
  blocked[50_000] = 0;
  blocked[50_001] = 0;
  blocked[49_999] = 1; // wall of zeros
  return [
    { name: "n=100000 reachable", args: [reachable] },
    { name: "n=100000 with zero wall", args: [blocked] },
  ];
}

// O(n^2) reachability dp
export function brute(nums: number[]): boolean {
  const reach = new Array<boolean>(nums.length).fill(false);
  reach[0] = true;
  for (let i = 0; i < nums.length; i++) {
    if (!reach[i]) continue;
    for (let j = 1; j <= nums[i] && i + j < nums.length; j++) reach[i + j] = true;
  }
  return reach[nums.length - 1];
}
