import { describe, it, expect } from "bun:test";
import { coinChange } from './index';


describe('Coin Change', () => {
    it('should return 3 for coins [1,5,10] and amount 12', () => {
        const coins = [1, 5, 10];
        const amount = 12;
        const result = coinChange(coins, amount);
        expect(result).toBe(3);
    });

    it('should return -1 for coins [2] and amount 3', () => {
        const coins = [2];
        const amount = 3;
        const result = coinChange(coins, amount);
        expect(result).toBe(-1);
    });

    it('should return 0 for coins [1] and amount 0', () => {
        const coins = [1];
        const amount = 0;
        const result = coinChange(coins, amount);
        expect(result).toBe(0);
    });

    it('should return 2 for coins [1, 5, 6] and amount 11', () => {
        const coins = [1, 5, 6];
        const amount = 11;
        const result = coinChange(coins, amount);
        expect(result).toBe(2);
    });

    it('should return 20 for coins [1, 2, 5] and amount 100', () => {
        const coins = [1, 2, 5];
        const amount = 100;
        const result = coinChange(coins, amount);
        expect(result).toBe(20);
    });
});
