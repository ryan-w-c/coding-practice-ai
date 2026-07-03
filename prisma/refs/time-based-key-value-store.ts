export class TimeMap {
  private store = new Map<string, [number, string][]>();

  set(key: string, value: string, timestamp: number): void {
    if (!this.store.has(key)) this.store.set(key, []);
    this.store.get(key)!.push([timestamp, value]);
  }

  get(key: string, timestamp: number): string {
    const arr = this.store.get(key) ?? [];
    let lo = 0, hi = arr.length - 1, ans = "";
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid][0] <= timestamp) {
        ans = arr[mid][1];
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return ans;
  }
}
