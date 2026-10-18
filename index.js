import express from 'express';
import dotenv from 'dotenv';
import './db.js';
import Book from './models/Book.js';
import Author from './models/Author.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/books', async (req, res) => {
    try {

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 5;
        const skip = (page - 1) * limit;

        const filter = req.query.genre ? { genre: req.query.genre } : {};

        const total = await Book.countDocuments(filter);

        let query = Book.find(filter).populate('author');

        if (req.query.sort) {
            query = query.sort(req.query.sort);
        }


        const data = await query.skip(skip).limit(limit);

        res.json({
            page,
            limit,
            total,
            data
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/books/:id', async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.json(updatedBook);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: err.message });
    }
});


app.get('/authors/:id/books', async (req, res) => {
    try {
        const books = await Book.find({ author: req.params.id });
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



app.put('/books/:id', async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBook);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/authors', async (req, res) => {
    try {
        const author = await Author.create(req.body);
        res.status(201).json(author);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.get('/authors', async (req, res) => {
    try {
        const authors = await Author.find();
        res.json(authors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});







app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
