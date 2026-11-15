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

function validatePositiveIntId(req, res, next) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "Must be an integer." });
    }
    next();
}

function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function trackFeature(feature, getMessage) {
    return (req, _res, next) => {
        Sentry.setTag("feature", feature);
        const message = typeof getMessage === "function" ? getMessage(req) : getMessage;
        Sentry.addBreadcrumb({ message, level: "info" });
        next();
    };
}


app.get("/", (req, res) => {
    res.send("Welcome to the Library API! Access book routes at /books");
});

app.use(express.static("public"));


app.get("/books", trackFeature("books", "Fetch books route"), async (req, res) => {
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

app.get("/books/:id", trackFeature("books", (req) => `Fetch book with ID ${req.params.id}`), async (req, res) => {
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


app.post("/books", trackFeature("books", "Create book route"), async (req, res) => {
    const { title, genre, published_year, author_id } = req.body;

    if (!isNonEmptyString(title)) {
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

app.put("/books/:id", trackFeature("books", (req) => `Replace book with ID ${req.params.id}`), async (req, res) => {
    const { id } = req.params;
    const { title, genre, published_year, author_id } = req.body;

    if (!isNonEmptyString(title)) {
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


app.patch("/books/:id", validatePositiveIntId, trackFeature("books", (req) => `Update book with ID ${req.params.id}`), async (req, res) => {
    const { id } = req.params;

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

    if (title !== undefined && !isNonEmptyString(title)) {
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

app.delete("/books/:id", trackFeature("books", (req) => `Delete book with ID ${req.params.id}`), async (req, res) => {
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


app.get("/authors", trackFeature("authors", "Fetch authors route"), async (req, res) => {
    try {
        const [, result] = await sequelize.query("SELECT * FROM authors ORDER BY id ASC");
        res.status(200).json(result.rows);
    } catch (err) {
        reportError(err, "authors");
        console.error("Error fetching authors:", err);
        res.status(500).json({ error: "Failed to fetch authors" });
    }
});

app.get("/authors/:id", validatePositiveIntId, trackFeature("authors", (req) => `Fetch author with ID ${req.params.id}`), async (req, res) => {
    const { id } = req.params;

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

app.post("/authors", trackFeature("authors", "Create author route"), async (req, res) => {
    const { name } = req.body;

    if (!isNonEmptyString(name)) {
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

app.get("/authors/:id/books", validatePositiveIntId, trackFeature("authors", (req) => `Fetch books for author ${req.params.id}`), async (req, res) => {
    const { id } = req.params;

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

app.post("/loans", trackFeature("loans", "Create loan route"), async (req, res) => {
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

app.get("/members/:id/loans", validatePositiveIntId, trackFeature("members", (req) => `Fetch loans for member ${req.params.id}`), async (req, res) => {
    const { id } = req.params;

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
