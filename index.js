import "./instrument.js";
import * as Sentry from "@sentry/node";
import express from "express";
import dotenv from "dotenv";
import sequelize, { connectToDatabase } from "./sequelize.js";
import { Author, Book, Member, Loan } from "./models/index.js";
import { reportError } from "./utils/reportError.js";

dotenv.config();

await connectToDatabase();

const app = express();

app.use(express.json());


app.get("/", (req, res) => {
    res.send("Welcome to the Library API! Access book routes at /books");
});

app.use(express.static("public"));


app.get("/books", async (req, res) => {
    Sentry.setTag("feature", "books");
    Sentry.addBreadcrumb({
        message: "Fetch books route",
        level: "info",
    });

    try {
        const { genre, sort } = req.query;
        const options = {
            order: [["id", "ASC"]],
            include: { model: Author, attributes: ["name"] },
        };

        if (genre) {
            options.where = { genre };
        }

        const allowedSorts = ["title", "published_year", "genre"];
        if (sort && allowedSorts.includes(sort)) {
            options.order = [[sort, "ASC"]];
        }

        const books = await Book.findAll(options);
        res.status(200).json(books);
    } catch (err) {
        reportError(err, "books");
        console.error("Error fetching books:", err);
        res.status(500).json({ error: "Failed to fetch books" });
    }
});

app.get("/books/:id", async (req, res) => {
    Sentry.setTag("feature", "books");
    Sentry.addBreadcrumb({
        message: `Fetch book with ID ${req.params.id}`,
        level: "info",
    });
    const { id } = req.params;


    try {
        const book = await Book.findByPk(id);

        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.status(200).json(book);
    } catch (err) {
        reportError(err, "books");
        console.error("Error fetching book:", err);
        res.status(500).json({ error: "Failed to fetch book" });
    }
});


app.post("/books", async (req, res) => {
    Sentry.setTag("feature", "books");
    Sentry.addBreadcrumb({
        message: "Create book route",
        level: "info",
    });
    const { title, genre, published_year, author_id } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({ error: "Title is required" });
    }

    try {
        const newBook = await Book.create({
            title: title.trim(),
            genre: genre || null,
            published_year: published_year || null,
            author_id: author_id ?? null,
        });

        res.status(201).json(newBook);
    } catch (err) {
        reportError(err, "books");
        console.error("Error creating book:", err);
        res.status(500).json({ error: "Failed to create book" });
    }
});

app.put("/books/:id", async (req, res) => {
    Sentry.setTag("feature", "books");
    Sentry.addBreadcrumb({
        message: `Replace book with ID ${req.params.id}`,
        level: "info",
    });
    const { id } = req.params;
    const { title, genre, published_year, author_id } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({ error: "Title is required" });
    }

    try {
        const book = await Book.findByPk(id);

        // 404 check
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        await book.update({
            title: title.trim(),
            genre: genre ?? book.genre,
            published_year: published_year ?? book.published_year,
            author_id: author_id ?? book.author_id,
        });

        res.status(200).json(book);
    } catch (err) {
        reportError(err, "books");
        console.error("Error updating book:", err);
        res.status(500).json({ error: "Failed to update book" });
    }
});


app.patch("/books/:id", async (req, res) => {
    Sentry.setTag("feature", "books");
    Sentry.addBreadcrumb({
        message: `Update book with ID ${req.params.id}`,
        level: "info",
    });
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({ error: "Must be an integer." });
    }

    if (!req.body || typeof req.body !== "object" || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Empty body" });
    }

    const { title, genre, published_year, author_id } = req.body;

    if (
        title === undefined &&
        genre === undefined &&
        published_year === undefined &&
        author_id === undefined
    ) {
        return res.status(400).json({ error: "At least one field must be provided" });
    }

    if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
        return res.status(400).json({ error: "Title cannot be empty" });
    }

    try {
        const [, result] = await sequelize.query(
            `UPDATE books
             SET title = COALESCE($1, title),
                 genre = COALESCE($2, genre),
                 published_year = COALESCE($3, published_year),
                 author_id = COALESCE($4, author_id)
             WHERE id = $5
             RETURNING *`,
            {
                bind: [
                    title !== undefined ? title.trim() : null,
                    genre !== undefined ? genre : null,
                    published_year !== undefined ? published_year : null,
                    author_id !== undefined ? author_id : null,
                    id,
                ]
            }
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        reportError(err, "books");
        if (err.parent?.code === "23503") {
            return res.status(400).json({ error: "Invalid author_id." });
        }
        console.error("Error updating book:", err);
        res.status(500).json({ error: "Failed to update book" });
    }
});

app.delete("/books/:id", async (req, res) => {
    Sentry.setTag("feature", "books");
    Sentry.addBreadcrumb({
        message: `Delete book with ID ${req.params.id}`,
        level: "info",
    });
    const { id } = req.params;

    try {
        const book = await Book.findByPk(id);

        // 404 check
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        await book.destroy();

        res.status(200).json({ message: "Book deleted successfully", book });
    } catch (err) {
        reportError(err, "books");
        console.error("Error deleting book:", err);
        res.status(500).json({ error: "Failed to delete book" });
    }
});


app.get("/authors", async (req, res) => {
    Sentry.setTag("feature", "authors");
    Sentry.addBreadcrumb({
        message: "Fetch authors route",
        level: "info",
    });

    try {
        const [, result] = await sequelize.query("SELECT * FROM authors ORDER BY id ASC");
        res.status(200).json(result.rows);
    } catch (err) {
        reportError(err, "authors");
        console.error("Error fetching authors:", err);
        res.status(500).json({ error: "Failed to fetch authors" });
    }
});

app.get("/authors/:id", async (req, res) => {
    Sentry.setTag("feature", "authors");
    Sentry.addBreadcrumb({
        message: `Fetch author with ID ${req.params.id}`,
        level: "info",
    });
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({ error: "Must be an integer." });
    }

    try {
        const [, result] = await sequelize.query("SELECT * FROM authors WHERE id = $1", { bind: [id] });

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Author not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        reportError(err, "authors");
        console.error("Error fetching author:", err);
        res.status(500).json({ error: "Failed to fetch author" });
    }
});

app.post("/authors", async (req, res) => {
    Sentry.setTag("feature", "authors");
    Sentry.addBreadcrumb({
        message: "Create author route",
        level: "info",
    });
    const { name } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ error: "Name is required" });
    }

    try {
        const [, result] = await sequelize.query(
            "INSERT INTO authors (name) VALUES ($1) RETURNING *",
            { bind: [name.trim()] }
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        reportError(err, "authors");
        console.error("Error adding author:", err);
        res.status(500).json({ error: "Failed to add author" });
    }
});

app.get("/authors/:id/books", async (req, res) => {
    Sentry.setTag("feature", "authors");
    Sentry.addBreadcrumb({
        message: `Fetch books for author ${req.params.id}`,
        level: "info",
    });
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({ error: "Must be an integer." });
    }

    try {
        const author = await Author.findByPk(id, {
            include: Book,
            order: [[Book, "id", "ASC"]],
        });

        if (!author) {
            return res.status(404).json({ error: "Author not found" });
        }

        res.status(200).json(author);
    } catch (err) {
        reportError(err, "authors");
        console.error("Error fetching author's books:", err);
        res.status(500).json({ error: "Failed to fetch" });
    }
});

app.post("/loans", async (req, res) => {
    Sentry.setTag("feature", "loans");
    Sentry.addBreadcrumb({
        message: "Create loan route",
        level: "info",
    });
    const { member_id, book_id } = req.body;

    if (!Number.isInteger(member_id) || !Number.isInteger(book_id)) {
        return res.status(400).json({ error: "member_id and book_id must be integers" });
    }

    try {
        const loan = await Loan.create({ member_id, book_id });
        res.status(201).json(loan);
    } catch (err) {
        reportError(err, "loans");
        if (err.parent?.code === "23503") {
            return res.status(400).json({ error: "Invalid member_id or book_id." });
        }
        console.error("Error creating loan:", err);
        res.status(500).json({ error: "Failed to create loan" });
    }
});

app.get("/members/:id/loans", async (req, res) => {
    Sentry.setTag("feature", "members");
    Sentry.addBreadcrumb({
        message: `Fetch loans for member ${req.params.id}`,
        level: "info",
    });
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({ error: "Must be an integer." });
    }

    try {
        const member = await Member.findByPk(id, {
            include: {
                model: Book,
                through: { attributes: ["loan_date", "returned_at"] },
            },
        });

        if (!member) {
            return res.status(404).json({ error: "Member not found" });
        }

        res.status(200).json(member);
    } catch (err) {
        reportError(err, "members");
        console.error("Error fetching member's loans:", err);
        res.status(500).json({ error: "Failed to fetch" });
    }
});


app.get("/debug-sentry", (req, res) => {
    throw new Error("My first Sentry error!");
});

Sentry.setupExpressErrorHandler(app);

const PORT = process.env.PORT || 3000;
if (!process.env.VITEST) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
