import { describe, test, expect } from "vitest";
import { chargeCustomer, createPizza, orderPizza, sendOrder } from "./pizzashop";

describe("Pizza Shop Unit Tests", () => {
    test("createPizza returns correct type and price", () => {
        const pizza = createPizza("margherita");

        expect(pizza).toEqual({ type: "margherita", price: 100 });
    });

    test("createPizza accepts vegetarian", () => {
        const pizza = createPizza("vegetarian");

        expect(pizza).toEqual({ type: "vegetarian", price: 110 });
    });

    test("createPizza throws for unknown type", () => {
        expect(() => createPizza("hawaii")).toThrow();
    });

    test("sendOrder returns a numeric order id", () => {
        const id = sendOrder({ type: "pepperoni", price: 120 });

        expect(typeof id).toBe("number");
        expect(Number.isInteger(id)).toBe(true);
        expect(id).toBeGreaterThanOrEqual(0);
        expect(id).toBeLessThan(1000);
    });

    test("orderPizza returns true for a valid pizza", () => {
        const result = orderPizza("pepperoni");

        expect(result).toBe(true);
    });

    test("chargeCustomer returns true for a valid order ID and amount", () => {
        expect(chargeCustomer(42, 100)).toBe(true);
    });

    test("chargeCustomer throws specific message when order ID is undefined", () => {
        expect(() => chargeCustomer(undefined, 100)).toThrow(
            "Cannot charge the customer without a valid order ID!"
        );
    });

    test("chargeCustomer throws when order ID is negative", () => {
        expect(() => chargeCustomer(-1, 100)).toThrow();
    });

    test("chargeCustomer throws when order ID is not a whole number", () => {
        expect(() => chargeCustomer(12.5, 100)).toThrow();
    });

    test("chargeCustomer throws when amount is 0", () => {
        expect(() => chargeCustomer(42, 0)).toThrow();
    });

    test("see margherita price", () =>{
        expect(createPizza("margherita").price).toBe(999);
    })

});
