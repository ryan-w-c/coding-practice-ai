import { describe, it, expect } from "bun:test";
import { KthLargest } from "./index";

describe("Kth Largest Integer in a Stream", () => {
    it("should correctly return the kth largest integer after each addition", () => {
        const kthLargest = new KthLargest(3, [1, 2, 3, 3]);

        expect(kthLargest.add(3)).toBe(3); // Stream: [1, 2, 3, 3, 3], 3rd largest is 3
        expect(kthLargest.add(5)).toBe(3); // Stream: [1, 2, 3, 3, 3, 5], 3rd largest is 3
        expect(kthLargest.add(6)).toBe(3); // Stream: [1, 2, 3, 3, 3, 5, 6], 3rd largest is 3
        expect(kthLargest.add(7)).toBe(5); // Stream: [1, 2, 3, 3, 3, 5, 6, 7], 3rd largest is 5
        expect(kthLargest.add(8)).toBe(6); // Stream: [1, 2, 3, 3, 3, 5, 6, 7, 8], 3rd largest is 6
    });

    it("should handle a stream starting with an empty array", () => {
        const kthLargest = new KthLargest(1, []);
        expect(kthLargest.add(5)).toBe(5); // Stream: [5], 1st largest is 5
        expect(kthLargest.add(10)).toBe(10); // Stream: [5, 10], 1st largest is 10
        expect(kthLargest.add(3)).toBe(10); // Stream: [5, 10, 3], 1st largest is 10
    });

    it("should return the correct kth largest when adding duplicate values", () => {
        const kthLargest = new KthLargest(2, [4, 5, 8, 2]);

        expect(kthLargest.add(3)).toBe(5); // Stream: [2, 3, 4, 5, 8], 2nd largest is 5
        expect(kthLargest.add(5)).toBe(5); // Stream: [2, 3, 4, 5, 5, 8], 2nd largest is 5
        expect(kthLargest.add(10)).toBe(8); // Stream: [2, 3, 4, 5, 5, 8, 10], 2nd largest is 8
        expect(kthLargest.add(9)).toBe(9); // Stream: [2, 3, 4, 5, 5, 8, 9, 10], 2nd largest is 9
        expect(kthLargest.add(4)).toBe(9); // Stream: [2, 3, 4, 4, 5, 5, 8, 9, 10], 2nd largest is 9
    });
});
