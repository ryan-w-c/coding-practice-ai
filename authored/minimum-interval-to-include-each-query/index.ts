/**
 * Minimum Interval to Include Each Query - Hard
 *
 * https://leetcode.com/problems/minimum-interval-to-include-each-query/
 */

export function minInterval(intervals: number[][], queries: number[]): number[] {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const qs = queries.map((q, i) => [q, i]).sort((a, b) => a[0] - b[0]);
  const out = new Array<number>(queries.length).fill(-1);
  // active sizes as a sorted-array "heap" keyed by (size, right)
  const active: [number, number][] = []; // [size, right], kept as min-heap
  const push = (v: [number, number]) => {
    active.push(v);
    let i = active.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (active[p][0] <= active[i][0]) break;
      [active[p], active[i]] = [active[i], active[p]];
      i = p;
    }
  };
  const pop = () => {
    const top = active[0];
    const last = active.pop()!;
    if (active.length) {
      active[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let sm = i;
        if (l < active.length && active[l][0] < active[sm][0]) sm = l;
        if (r < active.length && active[r][0] < active[sm][0]) sm = r;
        if (sm === i) break;
        [active[sm], active[i]] = [active[i], active[sm]];
        i = sm;
      }
    }
    return top;
  };
  let idx = 0;
  for (const [q, qi] of qs) {
    while (idx < sorted.length && sorted[idx][0] <= q) {
      const [l, r] = sorted[idx++];
      push([r - l + 1, r]);
    }
    while (active.length && active[0][1] < q) pop();
    if (active.length) out[qi] = active[0][0];
  }
  return out;
}
