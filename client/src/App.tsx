import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import { z } from "zod";
import { bookFormSchema } from "./schemas";

type Book = {
  id: number;
  title: string;
  genre: string | null;
  published_year: number | null;
  author_id: number | null;
  Author?: { name: string } | null;
};

type Author = {
  id: number;
  name: string;
};

type BookFormErrors = Partial<
  Record<"title" | "genre" | "published_year" | "author_id", string[]>
>;

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [errors, setErrors] = useState<BookFormErrors>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editGenre, setEditGenre] = useState("");
  const [editPublishedYear, setEditPublishedYear] = useState("");
  const [editAuthorId, setEditAuthorId] = useState("");
  const [editErrors, setEditErrors] = useState<BookFormErrors>({});


  const startEditing = (book: Book) => {
    setEditingId(book.id);
    setEditTitle(book.title);
    setEditGenre(book.genre ?? "");
    setEditPublishedYear(
      book.published_year ? String(book.published_year) : ""
    );
    setEditAuthorId(book.author_id ? String(book.author_id) : "");
    setEditErrors({});
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditErrors({});
  };

  const handleUpdate = async (
    event: FormEvent<HTMLFormElement>,
    id: number
  ) => {
    event.preventDefault();

    const result = bookFormSchema.safeParse({
      title: editTitle,
      genre: editGenre,
      published_year: editPublishedYear,
      author_id: editAuthorId,
    });

    if (!result.success) {
      setEditErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    setEditErrors({});
    await axios.put(`http://localhost:3000/books/${id}`, result.data);
    await fetchBooks();
    setEditingId(null);
  };


  const fetchBooks = async () => {
    const response = await axios.get<Book[]>("http://localhost:3000/books");
    setBooks(response.data);
  };

  const fetchAuthors = async () => {
    const response = await axios.get<Author[]>("http://localhost:3000/authors");
    setAuthors(response.data);
  };

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = bookFormSchema.safeParse({
      title,
      genre,
      published_year: publishedYear,
      author_id: authorId,
    });

    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    setErrors({});
    await axios.post("http://localhost:3000/books", result.data);
    await fetchBooks();

    setTitle("");
    setGenre("");
    setPublishedYear("");
    setAuthorId("");
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }

    await axios.delete(`http://localhost:3000/books/${id}`);
    setBooks(books.filter((book) => book.id !== id));
  };


  return (
    <div>
      <h1>Library</h1>

      <section>
        <h2>Add a book</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label>
              Title:{" "}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            {errors.title?.[0] && (
              <p style={{ color: "red" }}>{errors.title[0]}</p>
            )}
          </div>

          <div>
            <label>
              Genre:{" "}
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </label>
            {errors.genre?.[0] && (
              <p style={{ color: "red" }}>{errors.genre[0]}</p>
            )}
          </div>

          <div>
            <label>
              Published year:{" "}
              <input
                type="number"
                value={publishedYear}
                onChange={(e) => setPublishedYear(e.target.value)}
              />
            </label>
            {errors.published_year?.[0] && (
              <p style={{ color: "red" }}>{errors.published_year[0]}</p>
            )}
          </div>

          <div>
            <label>
              Author:{" "}
              <select
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
              >
                <option value="">-- Choose an author --</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </label>
            {errors.author_id?.[0] && (
              <p style={{ color: "red" }}>{errors.author_id[0]}</p>
            )}

            <ul>
              {books.map((book) => (
                <li key={book.id}>
                  {editingId === book.id ? (
                    <form
                      onSubmit={(e) => handleUpdate(e, book.id)}
                      noValidate
                    >
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Title"
                      />
                      {editErrors.title?.[0] && (
                        <span style={{ color: "red" }}>
                          {" "}
                          {editErrors.title[0]}
                        </span>
                      )}

                      <input
                        type="text"
                        value={editGenre}
                        onChange={(e) => setEditGenre(e.target.value)}
                        placeholder="Genre"
                      />
                      {editErrors.genre?.[0] && (
                        <span style={{ color: "red" }}>
                          {" "}
                          {editErrors.genre[0]}
                        </span>
                      )}

                      <input
                        type="number"
                        value={editPublishedYear}
                        onChange={(e) => setEditPublishedYear(e.target.value)}
                        placeholder="Year"
                      />
                      {editErrors.published_year?.[0] && (
                        <span style={{ color: "red" }}>
                          {" "}
                          {editErrors.published_year[0]}
                        </span>
                      )}

                      <select
                        value={editAuthorId}
                        onChange={(e) => setEditAuthorId(e.target.value)}
                      >
                        <option value="">-- Choose an author --</option>
                        {authors.map((author) => (
                          <option key={author.id} value={author.id}>
                            {author.name}
                          </option>
                        ))}
                      </select>
                      {editErrors.author_id?.[0] && (
                        <span style={{ color: "red" }}>
                          {" "}
                          {editErrors.author_id[0]}
                        </span>
                      )}

                      <button type="submit">Save</button>
                      <button type="button" onClick={cancelEditing}>
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <>
                      {book.title} by {book.Author?.name ?? "Unknown author"} (
                      {book.published_year ?? "N/A"}){" "}
                      <button
                        type="button"
                        onClick={() => startEditing(book)}
                      >
                        Edit
                      </button>{" "}
                      <button
                        type="button"
                        onClick={() => handleDelete(book.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <button type="submit">Add book</button>
        </form>
      </section>

      <section>
        <h2>Books</h2>
        <p>{books.length} books in the library</p>
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              {book.title} by {book.Author?.name ?? "Unknown author"} (
              {book.published_year ?? "N/A"})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Authors</h2>
        <p>{authors.length} authors</p>
        <ul>
          {authors.map((author) => (
            <li key={author.id}>{author.name}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
