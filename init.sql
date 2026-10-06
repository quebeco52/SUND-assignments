CREATE TABLE authors (
 id SERIAL PRIMARY KEY,
 name VARCHAR(100) NOT NULL
);

CREATE TABLE books (
 id SERIAL PRIMARY KEY,
 title VARCHAR(100) NOT NULL,
 genre VARCHAR(50),
 published_year INT
);

ALTER TABLE books ADD COLUMN author_id INT REFERENCES authors(id);

INSERT INTO books (title, genre, published_year)
VALUES
('The Hobbit', 'fantasy', 1937),
('1984', 'dystopian', 1949),
('Pippi Longstocking', 'children', 1945),
('The Hunger Games', 'dystopian', 2008);