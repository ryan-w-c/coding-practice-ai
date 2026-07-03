import { describe, it, expect } from "bun:test";
import { Twitter } from "./index";

describe("Twitter Feed System", () => {
    it("should correctly post tweets and get news feed", () => {
        const twitter = new Twitter();

        twitter.postTweet(1, 10);
        twitter.postTweet(2, 20);

        expect(twitter.getNewsFeed(1)).toEqual([10]);
        expect(twitter.getNewsFeed(2)).toEqual([20]);
    });

    it("should handle follow and unfollow correctly", () => {
        const twitter = new Twitter();

        twitter.postTweet(1, 10);
        twitter.postTweet(2, 20);
        twitter.follow(1, 2);

        expect(twitter.getNewsFeed(1)).toEqual([20, 10]);

        twitter.unfollow(1, 2);

        expect(twitter.getNewsFeed(1)).toEqual([10]);
    });

    it("should only fetch 10 most recent tweets", () => {
        const twitter = new Twitter();

        for (let i = 1; i <= 15; i++) {
            twitter.postTweet(1, i);
        }

        expect(twitter.getNewsFeed(1)).toEqual([15, 14, 13, 12, 11, 10, 9, 8, 7, 6]);
    });

    it("should return an empty feed for users with no tweets and not following anyone", () => {
        const twitter = new Twitter();

        expect(twitter.getNewsFeed(1)).toEqual([]);
    });
});
