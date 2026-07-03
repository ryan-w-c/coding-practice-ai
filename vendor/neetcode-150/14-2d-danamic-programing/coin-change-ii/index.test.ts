import { describe, it, expect } from "bun:test";
import { coinChangeII } from "./index";

describe("Coin Change II", () => {
    it("should return 4 for amount = 4 and coins = [1, 2, 3]", () => {
        const amount = 4;
        const coins = [1, 2, 3];
        const result = coinChangeII(amount, coins);
        expect(result).toBe(4);
    });

    it("should return 0 for amount = 7 and coins = [2, 4]", () => {
        const amount = 7;
        const coins = [2, 4];
        const result = coinChangeII(amount, coins);
        expect(result).toBe(0);
    });

    it("should return 1 for amount = 0 and coins = [1, 2, 3]", () => {
        const amount = 0;
        const coins = [1, 2, 3];
        const result = coinChangeII(amount, coins);
        expect(result).toBe(1);
    });

    it("should return 1 for amount = 3 and coins = [3]", () => {
        const amount = 3;
        const coins = [3];
        const result = coinChangeII(amount, coins);
        expect(result).toBe(1);
    });

    it("should return 3 for amount = 5 and coins = [1, 2, 5]", () => {
        const amount = 5;
        const coins = [1, 2, 5];
        const result = coinChangeII(amount, coins);
        expect(result).toBe(4);
    });
});
