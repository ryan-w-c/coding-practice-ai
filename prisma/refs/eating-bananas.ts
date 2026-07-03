export function minEatingSpeed(piles: number[], h: number): number {
  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {
    const k = (lo + hi) >> 1;
    let hours = 0;
    for (const p of piles) hours += Math.ceil(p / k);
    if (hours <= h) hi = k;
    else lo = k + 1;
  }
  return lo;
}
