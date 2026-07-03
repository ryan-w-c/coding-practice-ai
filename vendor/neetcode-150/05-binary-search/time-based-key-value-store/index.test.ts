import { describe, it, expect } from "bun:test";
import { TimeMap } from "./index";

describe("Time Based Key-Value Store", () => {
    it("should store and retrieve values correctly", () => {
        const timeMap = new TimeMap();

        timeMap.set("alice", "happy", 1);
        expect(timeMap.get("alice", 1)).toBe("happy");
        expect(timeMap.get("alice", 2)).toBe("happy");

        timeMap.set("alice", "sad", 3);
        expect(timeMap.get("alice", 3)).toBe("sad");
        expect(timeMap.get("alice", 2)).toBe("happy");
    });

    it("should handle non-existent keys gracefully", () => {
        const timeMap = new TimeMap();
        expect(timeMap.get("bob", 1)).toBe(""); // Should return empty string for non-existent key
    });

    it("should retrieve values with multiple timestamps", () => {
        const timeMap = new TimeMap();

        timeMap.set("bob", "first", 1);
        timeMap.set("bob", "second", 5);
        timeMap.set("bob", "third", 10);

        expect(timeMap.get("bob", 0)).toBe("");    // Before any value was set
        expect(timeMap.get("bob", 1)).toBe("first");
        expect(timeMap.get("bob", 4)).toBe("first");
        expect(timeMap.get("bob", 5)).toBe("second");
        expect(timeMap.get("bob", 7)).toBe("second");
        expect(timeMap.get("bob", 10)).toBe("third");
        expect(timeMap.get("bob", 11)).toBe("third"); // After the last timestamp
    });

    it("should handle large number of timestamps", () => {
        const timeMap = new TimeMap();
        for (let i = 1; i <= 100; i++) {
            timeMap.set("test", `value${i}`, i);
        }

        expect(timeMap.get("test", 50)).toBe("value50");
        expect(timeMap.get("test", 100)).toBe("value100");
        expect(timeMap.get("test", 101)).toBe("value100");
    });
});
