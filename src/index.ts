import express, { type Request, type Response } from "express";
import { pool } from "./db.js";
import { env } from "./env.js";
import { bookSchema, bookPatchSchema, bookQuerySchema, idParamSchema, type Book } from "./schemas.js";
import z from "zod";

const app = express();

app.use(express.json());

function isDatabaseError(err: unknown): err is { code: string } {
    return typeof err === "object" && err !== null && "code" in err;
}

// Skill 2
app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the Library API! Access book routes at /books");
});

app.use(express.static("public"));

app.get("/books", async (req: Request, res: Response) => {

    const parsedQuery = bookQuerySchema.safeParse(req.query);
    if (!parsedQuery.success) {
        return res.status(400).json({ errors: z.flattenError(parsedQuery.error) });
    }

    const { genre, sort, search, page, limit } = parsedQuery.data;

    try {
        let query = "SELECT * FROM books";
        const queryParams: (string | number)[] = [];
        const conditions: string[] = [];

        if (genre) {
            queryParams.push(genre);
            conditions.push(`genre = $${queryParams.length}`);
        }

        if (search) {
            queryParams.push(`%${search}%`);
            conditions.push(`title ILIKE $${queryParams.length}`);
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(" AND ")}`;
        }

        if (sort) {
            query += ` ORDER BY ${sort} ASC`;
        } else {
            query += " ORDER BY id ASC";
        }

        queryParams.push(limit);
        query += ` LIMIT $${queryParams.length}`;

        const offset = (page - 1) * limit;
        queryParams.push(offset);
        query += ` OFFSET $${queryParams.length}`;

        const result = await pool.query(query, queryParams);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching books:", err);
        res.status(500).json({ error: "Failed to fetch books" });
    }
});


app.get("/books/:id", async (req: Request, res: Response) => {
    const parsedParams = idParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
        return res.status(400).json({ errors: z.flattenError(parsedParams.error) });
    }
    const { id } = parsedParams.data;

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



app.post("/books", async (req: Request, res: Response) => {
    const parsed = bookSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({ errors: z.flattenError(parsed.error) });
    }

    const { title, genre, published_year, author_id } = parsed.data;

    try {
        const result = await pool.query<Book>(
            "INSERT INTO books (title, genre, published_year, author_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [title, genre, published_year, author_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error adding book:", getErrorMessage(err));
        res.status(500).json({ error: "Failed to add book" });
    }
});

app.put("/books/:id", async (req: Request, res: Response) => {
    const parsedParams = idParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
        return res.status(400).json({ errors: z.flattenError(parsedParams.error) });
    }

    const parsedBody = bookSchema.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json({ errors: z.flattenError(parsedBody.error) });
    }

    const { id } = parsedParams.data;
    const { title, genre, published_year, author_id } = parsedBody.data;

    try {
        const result = await pool.query<Book>(
            "UPDATE books SET title = $1, genre = $2, published_year = $3, author_id = $4 WHERE id = $5 RETURNING *",
            [title, genre, published_year, author_id, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error updating book:", getErrorMessage(err));
        res.status(500).json({ error: "Failed to update book" });
    }
});


app.patch("/books/:id", async (req: Request, res: Response) => {
    const parsedParams = idParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
        return res.status(400).json({ errors: z.flattenError(parsedParams.error) });
    }

    const parsedBody = bookPatchSchema.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json({ errors: z.flattenError(parsedBody.error) });
    }

    const { id } = parsedParams.data;
    const { title, genre, published_year, author_id } = parsedBody.data;

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
        if (isDatabaseError(err) && err.code === "23503") {
            return res.status(400).json({ error: "Invalid author_id." });
        }
        console.error("Error updating book:", err);
        res.status(500).json({ error: "Failed to update book" });
    }
});


app.delete("/books/:id", async (req: Request, res: Response) => {
    const parsedParams = idParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
        return res.status(400).json({ errors: z.flattenError(parsedParams.error) });
    }
    const { id } = parsedParams.data;

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


app.get("/authors", async (req: Request, res: Response) => {
    try {
        const result = await pool.query("SELECT * FROM authors ORDER BY id ASC");
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching authors:", err);
        res.status(500).json({ error: "Failed to fetch authors" });
    }
});

app.get("/authors/:id", async (req: Request, res: Response) => {
    const parsedParams = idParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
        return res.status(400).json({ errors: z.flattenError(parsedParams.error) });
    }
    const { id } = parsedParams.data;

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

app.post("/authors", async (req: Request, res: Response) => {
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

app.get("/authors/:id/books", async (req: Request, res: Response) => {
    const parsedParams = idParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
        return res.status(400).json({ errors: z.flattenError(parsedParams.error) });
    }
    const { id } = parsedParams.data;

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








function getErrorMessage(err: unknown): string {
    if (err instanceof Error) {
        return err.message;
    }
    return String(err);
}






app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
});
