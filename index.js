import express from "express";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();

const app = express();

app.use(express.json());

// Skill 2
app.get("/", (req, res) => {
    res.send("Welcome to the Library API! Access book routes at /books");
});

app.use(express.static("public"));

// 4.
app.get("/books", async (req, res) => {
    const { genre, sort } = req.query;

    const allowedSorts = ["title", "published_year", "genre"];
    if (sort && !allowedSorts.includes(sort)) {
        return res.status(400).json({
            error: `Invalid sort field. Allowed values: ${allowedSorts.join(", ")}`,
        });
    }

    try {
        let query = "SELECT * FROM books";
        const queryParams = [];

        if (genre) {
            queryParams.push(genre);
            query += ` WHERE genre = $${queryParams.length}`;
        }

        if (sort) {
            query += ` ORDER BY ${sort} ASC`;
        } else {
            query += " ORDER BY id ASC";
        }

        const result = await pool.query(query, queryParams);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching books:", err);
        res.status(500).json({ error: "Failed to fetch books" });
    }
});

app.get("/books/:id", async (req, res) => {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({ error: "Invalid book ID. Must be an integer." });
    }

    try {
        const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Book not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error fetching book:", err);
        res.status(500).json({ error: "Failed to fetch book" });
    }
});

// 6.
app.post("/books", async (req, res) => {
    const { title, genre, published_year, author_id } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({ error: "Title is required" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO books (title, genre, published_year, author_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [title.trim(), genre || null, published_year || null, author_id ?? null]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === "23503") {
            return res.status(400).json({ error: "Invalid author_id." });
        }
        console.error("Error adding book:", err);
        res.status(500).json({ error: "Failed to add book" });
    }
});

app.put("/books/:id", async (req, res) => {
    const { id } = req.params;
    const { title, genre, published_year, author_id } = req.body;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({ error: "Must be an integer." });
    }
    if (!title || typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({ error: "Title is required" });
    }

    try {
        const result = await pool.query(
            "UPDATE books SET title = $1, genre = $2, published_year = $3, author_id = $4 WHERE id = $5 RETURNING *",
            [title.trim(), genre || null, published_year || null, author_id ?? null, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        if (err.code === "23503") {
            return res.status(400).json({ error: "Invalid author_id." });
        }
        console.error("Error updating book:", err);
        res.status(500).json({ error: "Failed to update book" });
    }
});

// 5.
app.patch("/books/:id", async (req, res) => {
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
        const result = await pool.query(
            `UPDATE books
             SET title = COALESCE($1, title),
                 genre = COALESCE($2, genre),
                 published_year = COALESCE($3, published_year),
                 author_id = COALESCE($4, author_id)
             WHERE id = $5
             RETURNING *`,
            [
                title !== undefined ? title.trim() : null,
                genre !== undefined ? genre : null,
                published_year !== undefined ? published_year : null,
                author_id !== undefined ? author_id : null,
                id,
            ]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        if (err.code === "23503") {
            return res.status(400).json({ error: "Invalid author_id." });
        }
        console.error("Error updating book:", err);
        res.status(500).json({ error: "Failed to update book" });
    }
});

app.delete("/books/:id", async (req, res) => {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({ error: "Must be an integer." });
    }

    try {
        const result = await pool.query(
            "DELETE FROM books WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Book not found" });
        }

        res.status(200).json({ message: "Book deleted successfully", book: result.rows[0] });
    } catch (err) {
        console.error("Error deleting book:", err);
        res.status(500).json({ error: "Failed to delete book" });
    }
});

// 6.
app.get("/authors", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM authors ORDER BY id ASC");
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching authors:", err);
        res.status(500).json({ error: "Failed to fetch authors" });
    }
});

app.get("/authors/:id", async (req, res) => {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({ error: "Must be an integer." });
    }

    try {
        const result = await pool.query("SELECT * FROM authors WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Author not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error fetching author:", err);
        res.status(500).json({ error: "Failed to fetch author" });
    }
});

app.post("/authors", async (req, res) => {
    const { name } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ error: "Name is required" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO authors (name) VALUES ($1) RETURNING *",
            [name.trim()]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error adding author:", err);
        res.status(500).json({ error: "Failed to add author" });
    }
});

app.get("/authors/:id/books", async (req, res) => {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({ error: "Must be an integer." });
    }

    try {
        const authorCheck = await pool.query("SELECT * FROM authors WHERE id = $1", [id]);
        if (authorCheck.rows.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const result = await pool.query(
            `SELECT books.*, authors.name AS author_name
             FROM books
             JOIN authors ON books.author_id = authors.id
             WHERE authors.id = $1
             ORDER BY books.id ASC`,
            [id]
        );

        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching author's books:", err);
        res.status(500).json({ error: "Failed to fetch" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
