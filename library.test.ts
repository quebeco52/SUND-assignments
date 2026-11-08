import { describe, test, expect } from "vitest";
import { findBook, checkOutBook } from "./library";

describe("Library Unit Tests", () => {
    describe("findBook", () => {
        test("findBook('dune') returns { title: 'dune', copiesAvailable: 3 }", () => {
            expect(findBook("dune")).toEqual({
                title: "dune",
                copiesAvailable: 3,
            });
        });

        test("findBook('foundation') returns the book even with 0 copies", () => {
            expect(findBook("foundation")).toEqual({
                title: "foundation",
                copiesAvailable: 0,
            });
        });

        test("findBook('harry potter') throws", () => {
            expect(() => findBook("harry potter")).toThrow();
        });

        test("findBook(42) throws", () => {
            expect(() => findBook(42)).toThrow();
        });
    });

    describe("checkOutBook", () => {
        test("it returns a number", () => {
            const loanId = checkOutBook({ title: "dune", copiesAvailable: 3 });
            expect(typeof loanId).toBe("number");
        });

        test("the number is a whole number", () => {
            const loanId = checkOutBook({ title: "dune", copiesAvailable: 3 });
            expect(Number.isInteger(loanId)).toBe(true);
        });

        test("the number is between 1000 and 9999", () => {
            const loanId = checkOutBook({ title: "dune", copiesAvailable: 3 });
            expect(loanId).toBeGreaterThanOrEqual(1000);
            expect(loanId).toBeLessThanOrEqual(9999);
        });

        test("it throws 'No copies available' for { title: 'foundation', copiesAvailable: 0 }", () => {
            expect(() =>
                checkOutBook({ title: "foundation", copiesAvailable: 0 })
            ).toThrow("No copies available");
        });

        test("it throws for an object without copiesAvailable", () => {
            expect(() => checkOutBook({ title: "dune" })).toThrow();
        });
    });
});
