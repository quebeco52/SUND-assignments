import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true,
    },
    genre: {
        type: String,
        required: [true, 'Genre is required'],
        enum: {
            values: ['Fiction', 'Non-Fiction'],
            message: '{VALUE} is not a valid genre'
        },
    },
    publishedYear: {
        type: Number,
        required: [true, 'Published year is required'],
        min: [1000, 'Published year must be after 1000 AD'],
        max: [2026, 'Published year cannot be in the future'],
    },
}, { timestamps: true })

const Book = mongoose.model('Book', bookSchema);

export default Book;
