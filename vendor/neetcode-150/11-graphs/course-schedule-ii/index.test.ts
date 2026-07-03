import { describe, it, expect } from "bun:test";
import { findOrder } from "./index";

describe("Course Schedule II", () => {
    it("should return a valid order for numCourses = 3 and prerequisites = [[1, 0]]", () => {
        const numCourses = 3;
        const prerequisites = [[1, 0]];
        const result = findOrder(numCourses, prerequisites);

        // Assert that result is one of the expected valid orders
        const validOrders = [
            [0, 1, 2],
            [0, 2, 1]
        ];

        expect(validOrders).toContainEqual(result);
    });

    it("should return [] for numCourses = 3 and prerequisites = [[0, 1], [1, 2], [2, 0]] (cycle exists)", () => {
        const numCourses = 3;
        const prerequisites = [[0, 1], [1, 2], [2, 0]];
        const result = findOrder(numCourses, prerequisites);
        expect(result).toEqual([]);
    });

    it("should return [0] for numCourses = 1 and no prerequisites", () => {
        const numCourses = 1;
        const prerequisites: number[][] = [];
        const result = findOrder(numCourses, prerequisites);
        expect(result).toEqual([0]);
    });

    it("should handle a larger input with multiple valid outputs", () => {
        const numCourses = 4;
        const prerequisites = [[1, 0], [2, 0], [3, 1], [3, 2]];
        const result = findOrder(numCourses, prerequisites);
        expect(result).toContain(0);
        expect(result).toContain(1);
        expect(result).toContain(2);
        expect(result).toContain(3);
    });

    it("should return an empty array if it's not possible to complete all courses", () => {
        const numCourses = 2;
        const prerequisites = [[1, 0], [0, 1]];
        const result = findOrder(numCourses, prerequisites);
        expect(result).toEqual([]);
    });
});
