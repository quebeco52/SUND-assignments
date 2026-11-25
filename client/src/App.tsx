import { useEffect, useState } from "react";
    import axios from "axios";

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

    function App() {
      const [books, setBooks] = useState<Book[]>([]);
      const [authors, setAuthors] = useState<Author[]>([]);

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

      return (
        <div>
          <h1>Library</h1>

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