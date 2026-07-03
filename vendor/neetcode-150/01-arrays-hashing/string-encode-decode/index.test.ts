import { describe, it, expect } from "bun:test";
import { Codec } from "./index";

describe("String Encode and Decode", () => {
    const codec = new Codec();

    it("should encode and decode ['neet','code','love','you'] correctly", () => {
        const strs = ["neet", "code", "love", "you"];
        const encoded = codec.encode(strs);
        const decoded = codec.decode(encoded);
        expect(decoded).toEqual(strs);
    });

    it("should encode and decode ['we','say',':','yes'] correctly", () => {
        const strs = ["we", "say", ":", "yes"];
        const encoded = codec.encode(strs);
        const decoded = codec.decode(encoded);
        expect(decoded).toEqual(strs);
    });

    it("should handle an empty list correctly", () => {
        const strs: string[] = [];
        const encoded = codec.encode(strs);
        const decoded = codec.decode(encoded);
        expect(decoded).toEqual(strs);
    });

    it("should handle single character strings", () => {
        const strs = ["a", "b", "c"];
        const encoded = codec.encode(strs);
        const decoded = codec.decode(encoded);
        expect(decoded).toEqual(strs);
    });

    it("should handle strings with special characters", () => {
        const strs = ["#", "hello#", "12#34", ""];
        const encoded = codec.encode(strs);
        const decoded = codec.decode(encoded);
        expect(decoded).toEqual(strs);
    });
});
