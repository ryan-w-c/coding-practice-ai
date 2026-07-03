import java.util.*;

class TimeMap {
    private final Map<String, List<Object[]>> store = new HashMap<>();

    public TimeMap() {}

    public void set(String key, String value, int timestamp) {
        store.computeIfAbsent(key, k -> new ArrayList<>()).add(new Object[]{timestamp, value});
    }

    public String get(String key, int timestamp) {
        List<Object[]> arr = store.getOrDefault(key, Collections.emptyList());
        int lo = 0, hi = arr.size() - 1;
        String ans = "";
        while (lo <= hi) {
            int mid = (lo + hi) >>> 1;
            if ((int) arr.get(mid)[0] <= timestamp) {
                ans = (String) arr.get(mid)[1];
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return ans;
    }
}
