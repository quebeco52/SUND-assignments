import { describe, test, expect } from "vitest";
import {
    PizzaTypeSchema,
    PizzaSchema,
    AmountSchema,
    OrderIdSchema,
} from "./pizzashop";

describe("Schema Unit Tests", () => {
    test("PizzaTypeSchema.parse('margherita') returns 'margherita'", () => {
        expect(PizzaTypeSchema.parse("margherita")).toBe("margherita");
    });

    test("PizzaTypeSchema.parse('Margherita') (capital M) throws", () => {
        expect(() => PizzaTypeSchema.parse("Margherita")).toThrow();
    });

    test("PizzaSchema.parse({ type: 'pepperoni', price: 120 }) returns an equal object", () => {
        expect(PizzaSchema.parse({ type: "pepperoni", price: 120 })).toEqual({
            type: "pepperoni",
            price: 120,
        });
    });

    test("PizzaSchema.parse({ type: 'pepperoni' }) throws because price is missing", () => {
        expect(() => PizzaSchema.parse({ type: "pepperoni" })).toThrow();
    });

    test("AmountSchema.parse('100') throws because string is not a number", () => {
        expect(() => AmountSchema.parse("100")).toThrow();
    });

    test("OrderIdSchema.parse(0) does not throw and returns 0", () => {
        expect(OrderIdSchema.parse(0)).toBe(0);
    });
});
