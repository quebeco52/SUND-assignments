import { describe, test, expect } from "vitest";
import { findBook } from "./library";

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
});
