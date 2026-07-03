export class Twitter {
  private time = 0;
  private tweets = new Map<number, [number, number][]>(); // user -> [time, tweetId]
  private follows = new Map<number, Set<number>>();

  postTweet(userId: number, tweetId: number): void {
    if (!this.tweets.has(userId)) this.tweets.set(userId, []);
    this.tweets.get(userId)!.push([this.time++, tweetId]);
  }

  getNewsFeed(userId: number): number[] {
    const users = new Set(this.follows.get(userId) ?? []);
    users.add(userId);
    const all: [number, number][] = [];
    for (const u of users) all.push(...(this.tweets.get(u) ?? []));
    return all
      .sort((a, b) => b[0] - a[0])
      .slice(0, 10)
      .map(([, id]) => id);
  }

  follow(followerId: number, followeeId: number): void {
    if (!this.follows.has(followerId)) this.follows.set(followerId, new Set());
    this.follows.get(followerId)!.add(followeeId);
  }

  unfollow(followerId: number, followeeId: number): void {
    this.follows.get(followerId)?.delete(followeeId);
  }
}
