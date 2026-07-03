/**
 * Detect Squares - Medium
 *
 * https://leetcode.com/problems/detect-squares/
 */

export class DetectSquares {
  private counts = new Map<string, number>();
  private points: [number, number][] = [];

  add(point: number[]): void {
    const [x, y] = point;
    const key = `${x},${y}`;
    this.counts.set(key, (this.counts.get(key) ?? 0) + 1);
    this.points.push([x, y]);
  }

  count(point: number[]): number {
    const [qx, qy] = point;
    let total = 0;
    // pick a diagonal corner among added points, then check the two remaining corners
    for (const [x, y] of this.points) {
      if (Math.abs(x - qx) !== Math.abs(y - qy) || x === qx) continue;
      total +=
        (this.counts.get(`${x},${qy}`) ?? 0) * (this.counts.get(`${qx},${y}`) ?? 0);
    }
    return total;
  }
}
