import { describe, test, expect } from "vitest";
import { borrowBook } from "./library";

describe("Library Integration Tests", () => {
    test("borrowBook('dune', 7) returns a loan with title 'dune' and member ID 7", () => {
        const loan = borrowBook("dune", 7);

        expect(loan.title).toBe("dune");
        expect(loan.memberId).toBe(7);
        expect(loan.loanId).toBeGreaterThanOrEqual(1000);
        expect(loan.loanId).toBeLessThanOrEqual(9999);
    });

    test("borrowBook('foundation', 7) throws 'No copies available'", () => {
        expect(() => borrowBook("foundation", 7)).toThrow("No copies available");
    });

    test("borrowBook('dune', -1) throws for invalid memberId", () => {
        expect(() => borrowBook("dune", -1)).toThrow();
    });
});