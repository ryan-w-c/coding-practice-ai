import { describe, it, expect } from "bun:test";
import { kClosest } from "./index";

describe("K Closest Points to Origin", () => {
    it("should return [[0,2]] for input points [[0,2],[2,2]] and k = 1", () => {
        const points = [[0, 2], [2, 2]];
        const k = 1;
        const result = kClosest(points, k);
        expect(result).toEqual([[0, 2]]);
    });

    it("should return [[0,2],[2,0]] for input points [[0,2],[2,0],[2,2]] and k = 2", () => {
        const points = [[0, 2], [2, 0], [2, 2]];
        const k = 2;
        const result = kClosest(points, k);
        expect(result).toEqual(expect.arrayContaining([[0, 2], [2, 0]]));
    });

    it("should return [[0,1]] for input points [[0,1],[1,1],[2,2]] and k = 1", () => {
        const points = [[0, 1], [1, 1], [2, 2]];
        const k = 1;
        const result = kClosest(points, k);
        expect(result).toEqual([[0, 1]]);
    });

    it("should return all points if k equals the length of points", () => {
        const points = [[0, 2], [2, 0], [2, 2]];
        const k = 3;
        const result = kClosest(points, k);
        expect(result).toEqual(expect.arrayContaining([[0, 2], [2, 0], [2, 2]]));
    });

    it("should return the correct k closest points for negative coordinates", () => {
        const points = [[-2, -4], [0, 1], [-1, -1], [3, 3]];
        const k = 2;
        const result = kClosest(points, k);
        expect(result).toEqual(expect.arrayContaining([[-1, -1], [0, 1]]));
    });
});
