import { describe, it, expect } from "bun:test";
import { findCheapestPrice } from "./index";

describe("Cheapest Flight Path", () => {
    it("should return 500 for n = 4, flights = [[0,1,200],[1,2,100],[1,3,300],[2,3,100]], src = 0, dst = 3, k = 1", () => {
        const n = 4;
        const flights = [[0, 1, 200], [1, 2, 100], [1, 3, 300], [2, 3, 100]];
        const src = 0;
        const dst = 3;
        const k = 1;
        const result = findCheapestPrice(n, flights, src, dst, k);
        expect(result).toBe(500);
    });

    it("should return 200 for n = 3, flights = [[1,0,100],[1,2,200],[0,2,100]], src = 1, dst = 2, k = 1", () => {
        const n = 3;
        const flights = [[1, 0, 100], [1, 2, 200], [0, 2, 100]];
        const src = 1;
        const dst = 2;
        const k = 1;
        const result = findCheapestPrice(n, flights, src, dst, k);
        expect(result).toBe(200);
    });

    it("should return -1 if it's impossible to reach the destination with given k stops", () => {
        const n = 3;
        const flights = [[0, 1, 100], [1, 2, 100], [2, 0, 100]];
        const src = 0;
        const dst = 2;
        const k = 0;
        const result = findCheapestPrice(n, flights, src, dst, k);
        expect(result).toBe(-1);
    });
});
