from collections import defaultdict


class Twitter:
    def __init__(self):
        self.time = 0
        self.tweets = defaultdict(list)   # user -> [(time, tweetId)]
        self.follows = defaultdict(set)

    def postTweet(self, user_id, tweet_id):
        self.tweets[user_id].append((self.time, tweet_id))
        self.time += 1

    def getNewsFeed(self, user_id):
        users = self.follows[user_id] | {user_id}
        all_tweets = [t for u in users for t in self.tweets[u]]
        all_tweets.sort(reverse=True)
        return [tid for _, tid in all_tweets[:10]]

    def follow(self, follower_id, followee_id):
        self.follows[follower_id].add(followee_id)

    def unfollow(self, follower_id, followee_id):
        self.follows[follower_id].discard(followee_id)
