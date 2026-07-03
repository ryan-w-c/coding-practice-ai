import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; steps: { method: string; args: unknown[] }[] }[] = [];
  for (let i = 0; i < 6; i++) {
    const users = rng.int(2, 8);
    const ops = rng.int(20, 150);
    const steps: { method: string; args: unknown[] }[] = [{ method: "constructor", args: [] }];
    let tweetId = 1;
    for (let k = 0; k < ops; k++) {
      const u = rng.int(1, users);
      const r = rng.next();
      if (r < 0.4) steps.push({ method: "postTweet", args: [u, tweetId++] });
      else if (r < 0.6) steps.push({ method: "follow", args: [u, rng.int(1, users)] });
      else if (r < 0.75) steps.push({ method: "unfollow", args: [u, rng.int(1, users)] });
      else steps.push({ method: "getNewsFeed", args: [u] });
    }
    out.push({ name: `random ops #${i} (${users} users)`, steps });
  }
  return out;
}

export class bruteClass {
  private time = 0;
  private tweets: [number, number, number][] = []; // time, user, tweetId
  private follows = new Map<number, Set<number>>();
  postTweet(userId: number, tweetId: number): void {
    this.tweets.push([this.time++, userId, tweetId]);
  }
  getNewsFeed(userId: number): number[] {
    const visible = new Set(this.follows.get(userId) ?? []);
    visible.add(userId);
    return this.tweets
      .filter(([, u]) => visible.has(u))
      .sort((a, b) => b[0] - a[0])
      .slice(0, 10)
      .map(([, , id]) => id);
  }
  follow(a: number, b: number): void {
    if (!this.follows.has(a)) this.follows.set(a, new Set());
    this.follows.get(a)!.add(b);
  }
  unfollow(a: number, b: number): void {
    this.follows.get(a)?.delete(b);
  }
}
