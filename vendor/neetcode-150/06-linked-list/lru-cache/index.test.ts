import { describe, it, expect } from "bun:test";
import { LRUCache } from "./index";

describe("LRUCache", () => {
    it("should return the correct values and handle cache evictions", () => {
        const lruCache = new LRUCache(2);

        lruCache.put(1, 10);
        expect(lruCache.get(1)).toBe(10);  // cache: {1=10}

        lruCache.put(2, 20);
        expect(lruCache.get(2)).toBe(20);  // cache: {1=10, 2=20}

        lruCache.put(3, 30); // cache: {2=20, 3=30}, key 1 should be evicted
        expect(lruCache.get(1)).toBe(-1); // key 1 was evicted

        expect(lruCache.get(2)).toBe(20);  // cache: {3=30, 2=20}
        expect(lruCache.get(3)).toBe(30);  // cache: {2=20, 3=30}
    });

    it("should handle edge cases with only one element", () => {
        const lruCache = new LRUCache(1);

        lruCache.put(1, 10);
        expect(lruCache.get(1)).toBe(10);  // cache: {1=10}

        lruCache.put(2, 20); // cache: {2=20}, key 1 should be evicted
        expect(lruCache.get(1)).toBe(-1);  // key 1 was evicted
        expect(lruCache.get(2)).toBe(20);  // cache: {2=20}
    });
});
