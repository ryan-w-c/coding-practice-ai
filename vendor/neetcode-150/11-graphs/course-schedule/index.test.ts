import { describe, it, expect } from "bun:test";
import { canFinish } from "./index";

describe("Course Schedule", () => {
    it("should return true for numCourses = 2 and prerequisites = [[0, 1]]", () => {
        const numCourses = 2;
        const prerequisites = [[0, 1]];
        expect(canFinish(numCourses, prerequisites)).toBe(true);
    });

    it("should return false for numCourses = 2 and prerequisites = [[0, 1], [1, 0]]", () => {
        const numCourses = 2;
        const prerequisites = [[0, 1], [1, 0]];
        expect(canFinish(numCourses, prerequisites)).toBe(false);
    });

    it("should return true for numCourses = 4 and no prerequisites", () => {
        const numCourses = 4;
        const prerequisites: number[][] = [];
        expect(canFinish(numCourses, prerequisites)).toBe(true);
    });

    it("should return false for numCourses = 3 and prerequisites = [[0, 1], [1, 2], [2, 0]]", () => {
        const numCourses = 3;
        const prerequisites = [[0, 1], [1, 2], [2, 0]];
        expect(canFinish(numCourses, prerequisites)).toBe(false);
    });

    it("should return true for numCourses = 5 and prerequisites = [[1, 0], [2, 1], [3, 2], [4, 3]]", () => {
        const numCourses = 5;
        const prerequisites = [[1, 0], [2, 1], [3, 2], [4, 3]];
        expect(canFinish(numCourses, prerequisites)).toBe(true);
    });
});
