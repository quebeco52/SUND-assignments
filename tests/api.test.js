import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

vi.mock("../instrument.js", () => ({}));

vi.mock("@sentry/node", () => ({
    setTag: vi.fn(),
    addBreadcrumb: vi.fn(),
    captureException: vi.fn(),
    setupExpressErrorHandler: vi.fn(),
}));

const mockSequelize = {
    authenticate: vi.fn().mockResolvedValue(undefined),
    query: vi.fn(),
};

vi.mock("../sequelize.js", () => ({
    default: mockSequelize,
    connectToDatabase: vi.fn().mockResolvedValue(undefined),
}));

const mockAuthor = { findByPk: vi.fn() };
const mockBook = { findAll: vi.fn(), findByPk: vi.fn(), create: vi.fn() };
const mockMember = { findByPk: vi.fn() };
const mockLoan = { create: vi.fn() };

vi.mock("../models/index.js", () => ({
    Author: mockAuthor,
    Book: mockBook,
    Member: mockMember,
    Loan: mockLoan,
}));

const { default: app } = await import("../index.js");

describe("Library Express API", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => {});
        vi.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("GET / returns the welcome message", async () => {
        const res = await request(app).get("/");

        expect(res.status).toBe(200);
        expect(res.text).toContain("Welcome to the Library API");
    });

    describe("Book routes", () => {
        it("GET /books returns books with default order", async () => {
            const books = [{ id: 1, title: "Dune" }];
            mockBook.findAll.mockResolvedValue(books);

            const res = await request(app).get("/books");

            expect(res.status).toBe(200);
            expect(res.body).toEqual(books);
            expect(mockBook.findAll).toHaveBeenCalledWith({
                order: [["id", "ASC"]],
                include: { model: mockAuthor, attributes: ["name"] },
            });
        });

        it("GET /books applies genre filter and allowed sort", async () => {
            mockBook.findAll.mockResolvedValue([]);

            const res = await request(app).get("/books?genre=Sci-Fi&sort=title");

            expect(res.status).toBe(200);
            expect(mockBook.findAll).toHaveBeenCalledWith({
                order: [["title", "ASC"]],
                include: { model: mockAuthor, attributes: ["name"] },
                where: { genre: "Sci-Fi" },
            });
        });

        it("GET /books ignores disallowed sort columns", async () => {
            mockBook.findAll.mockResolvedValue([]);

            const res = await request(app).get("/books?sort=DROP_TABLE");

            expect(res.status).toBe(200);
            expect(mockBook.findAll).toHaveBeenCalledWith({
                order: [["id", "ASC"]],
                include: { model: mockAuthor, attributes: ["name"] },
            });
        });

        it("GET /books returns 500 when Book.findAll rejects", async () => {
            mockBook.findAll.mockRejectedValue(new Error("DB error"));

            const res = await request(app).get("/books");

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: "Failed to fetch books" });
        });

        it("GET /books/:id returns 200 when found and 404 when missing", async () => {
            mockBook.findByPk.mockResolvedValueOnce({ id: 1, title: "Dune" });
            const found = await request(app).get("/books/1");
            expect(found.status).toBe(200);
            expect(found.body).toEqual({ id: 1, title: "Dune" });

            mockBook.findByPk.mockResolvedValueOnce(null);
            const missing = await request(app).get("/books/999");
            expect(missing.status).toBe(404);
            expect(missing.body).toEqual({ error: "Book not found" });
        });

        it("POST /books rejects empty title with 400 and creates valid book with 201", async () => {
            const invalid = await request(app).post("/books").send({ title: "   " });
            expect(invalid.status).toBe(400);
            expect(invalid.body).toEqual({ error: "Title is required" });

            const created = { id: 1, title: "Dune", genre: null, published_year: null, author_id: null };
            mockBook.create.mockResolvedValue(created);

            const valid = await request(app).post("/books").send({ title: "  Dune  " });
            expect(valid.status).toBe(201);
            expect(valid.body).toEqual(created);
            expect(mockBook.create).toHaveBeenCalledWith({
                title: "Dune",
                genre: null,
                published_year: null,
                author_id: null,
            });
        });

        it("PUT /books/:id validates title, returns 404 if missing, and updates existing book", async () => {
            const invalid = await request(app).put("/books/1").send({ title: "" });
            expect(invalid.status).toBe(400);

            mockBook.findByPk.mockResolvedValueOnce(null);
            const missing = await request(app).put("/books/1").send({ title: "Updated" });
            expect(missing.status).toBe(404);

            const bookRecord = {
                id: 1,
                title: "Old",
                genre: "Fantasy",
                published_year: 2000,
                author_id: 2,
                update: vi.fn().mockResolvedValue(undefined),
            };
            mockBook.findByPk.mockResolvedValueOnce(bookRecord);

            const updated = await request(app).put("/books/1").send({ title: "  New  " });
            expect(updated.status).toBe(200);
            expect(bookRecord.update).toHaveBeenCalledWith({
                title: "New",
                genre: "Fantasy",
                published_year: 2000,
                author_id: 2,
            });
        });

        it("PATCH /books/:id validates id, body, and updates row", async () => {
            const badId = await request(app).patch("/books/abc").send({ title: "X" });
            expect(badId.status).toBe(400);
            expect(badId.body).toEqual({ error: "Must be an integer." });

            const emptyBody = await request(app).patch("/books/1").send({});
            expect(emptyBody.status).toBe(400);
            expect(emptyBody.body).toEqual({ error: "Empty body" });

            const noFields = await request(app).patch("/books/1").send({ extra: "ignored" });
            expect(noFields.status).toBe(400);

            const emptyTitle = await request(app).patch("/books/1").send({ title: "  " });
            expect(emptyTitle.status).toBe(400);

            mockSequelize.query.mockResolvedValueOnce([[], { rowCount: 0, rows: [] }]);
            const missing = await request(app).patch("/books/99").send({ title: "New" });
            expect(missing.status).toBe(404);

            mockSequelize.query.mockResolvedValueOnce([[], { rowCount: 1, rows: [{ id: 1, title: "New" }] }]);
            const ok = await request(app).patch("/books/1").send({ title: " New " });
            expect(ok.status).toBe(200);
            expect(ok.body).toEqual({ id: 1, title: "New" });

            mockSequelize.query.mockRejectedValueOnce({ parent: { code: "23503" } });
            const badFk = await request(app).patch("/books/1").send({ author_id: 999 });
            expect(badFk.status).toBe(400);
            expect(badFk.body).toEqual({ error: "Invalid author_id." });
        });

        it("DELETE /books/:id returns 404 when missing and 200 when deleted", async () => {
            mockBook.findByPk.mockResolvedValueOnce(null);
            const missing = await request(app).delete("/books/1");
            expect(missing.status).toBe(404);

            const bookRecord = { id: 1, title: "Dune", destroy: vi.fn().mockResolvedValue(undefined) };
            mockBook.findByPk.mockResolvedValueOnce(bookRecord);
            const deleted = await request(app).delete("/books/1");
            expect(deleted.status).toBe(200);
            expect(bookRecord.destroy).toHaveBeenCalledOnce();
        });
    });

    describe("Author, Loan, and Member routes", () => {
        it("GET /authors returns all authors", async () => {
            mockSequelize.query.mockResolvedValueOnce([[], { rows: [{ id: 1, name: "Frank" }] }]);
            const res = await request(app).get("/authors");
            expect(res.status).toBe(200);
            expect(res.body).toEqual([{ id: 1, name: "Frank" }]);
        });

        it("GET /authors/:id validates id, returns 404 if missing, and 200 if found", async () => {
            const badId = await request(app).get("/authors/0");
            expect(badId.status).toBe(400);

            mockSequelize.query.mockResolvedValueOnce([[], { rows: [] }]);
            const missing = await request(app).get("/authors/1");
            expect(missing.status).toBe(404);

            mockSequelize.query.mockResolvedValueOnce([[], { rows: [{ id: 1, name: "Frank" }] }]);
            const ok = await request(app).get("/authors/1");
            expect(ok.status).toBe(200);
            expect(ok.body).toEqual({ id: 1, name: "Frank" });
        });

        it("POST /authors rejects blank name and creates trimmed author", async () => {
            const invalid = await request(app).post("/authors").send({ name: "" });
            expect(invalid.status).toBe(400);

            mockSequelize.query.mockResolvedValueOnce([[], { rows: [{ id: 1, name: "Frank" }] }]);
            const ok = await request(app).post("/authors").send({ name: " Frank " });
            expect(ok.status).toBe(201);
            expect(ok.body).toEqual({ id: 1, name: "Frank" });
        });

        it("GET /authors/:id/books validates id, handles 404, and returns author with books", async () => {
            const badId = await request(app).get("/authors/-1/books");
            expect(badId.status).toBe(400);

            mockAuthor.findByPk.mockResolvedValueOnce(null);
            const missing = await request(app).get("/authors/1/books");
            expect(missing.status).toBe(404);

            mockAuthor.findByPk.mockResolvedValueOnce({ id: 1, name: "Frank", Books: [] });
            const ok = await request(app).get("/authors/1/books");
            expect(ok.status).toBe(200);
            expect(ok.body).toEqual({ id: 1, name: "Frank", Books: [] });
        });

        it("POST /loans validates integers, creates loan, and handles invalid FK", async () => {
            const badBody = await request(app).post("/loans").send({ member_id: "1", book_id: 2 });
            expect(badBody.status).toBe(400);

            mockLoan.create.mockResolvedValueOnce({ id: 1, member_id: 1, book_id: 2 });
            const ok = await request(app).post("/loans").send({ member_id: 1, book_id: 2 });
            expect(ok.status).toBe(201);

            mockLoan.create.mockRejectedValueOnce({ parent: { code: "23503" } });
            const badFk = await request(app).post("/loans").send({ member_id: 1, book_id: 999 });
            expect(badFk.status).toBe(400);
            expect(badFk.body).toEqual({ error: "Invalid member_id or book_id." });
        });

        it("GET /members/:id/loans validates id, handles 404, and returns member loans", async () => {
            const badId = await request(app).get("/members/abc/loans");
            expect(badId.status).toBe(400);

            mockMember.findByPk.mockResolvedValueOnce(null);
            const missing = await request(app).get("/members/1/loans");
            expect(missing.status).toBe(404);

            mockMember.findByPk.mockResolvedValueOnce({ id: 1, name: "Alice", Books: [] });
            const ok = await request(app).get("/members/1/loans");
            expect(ok.status).toBe(200);
            expect(ok.body).toEqual({ id: 1, name: "Alice", Books: [] });
        });
    });

    it("GET /debug-sentry throws an error handled with 500", async () => {
        const res = await request(app).get("/debug-sentry");
        expect(res.status).toBe(500);
    });
});
