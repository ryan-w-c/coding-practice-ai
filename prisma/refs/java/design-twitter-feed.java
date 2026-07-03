import java.util.*;

class Twitter {
    private int time = 0;
    private final Map<Integer, List<int[]>> tweets = new HashMap<>();  // user -> [time, tweetId]
    private final Map<Integer, Set<Integer>> follows = new HashMap<>();

    public Twitter() {}

    public void postTweet(int userId, int tweetId) {
        tweets.computeIfAbsent(userId, k -> new ArrayList<>()).add(new int[]{time++, tweetId});
    }

    public List<Integer> getNewsFeed(int userId) {
        Set<Integer> users = new HashSet<>(follows.getOrDefault(userId, Collections.emptySet()));
        users.add(userId);
        List<int[]> all = new ArrayList<>();
        for (int u : users) all.addAll(tweets.getOrDefault(u, Collections.emptyList()));
        all.sort((a, b) -> b[0] - a[0]);
        List<Integer> out = new ArrayList<>();
        for (int i = 0; i < Math.min(10, all.size()); i++) out.add(all.get(i)[1]);
        return out;
    }

    public void follow(int followerId, int followeeId) {
        follows.computeIfAbsent(followerId, k -> new HashSet<>()).add(followeeId);
    }

    public void unfollow(int followerId, int followeeId) {
        Set<Integer> s = follows.get(followerId);
        if (s != null) s.remove(followeeId);
    }
}
