CREATE TABLE authors (
 id SERIAL PRIMARY KEY,
 name VARCHAR(100) NOT NULL
);

CREATE TABLE books (
 id SERIAL PRIMARY KEY,
 title VARCHAR(100) NOT NULL,
 genre VARCHAR(50),
 published_year INT,
 author_id INT REFERENCES authors(id)
);

CREATE TABLE members (
 id SERIAL PRIMARY KEY,
 name VARCHAR(100) NOT NULL
);

CREATE TABLE loans (
 id SERIAL PRIMARY KEY,
 member_id INT NOT NULL REFERENCES members(id),
 book_id INT NOT NULL REFERENCES books(id),
 loan_date DATE NOT NULL DEFAULT CURRENT_DATE,
 returned_at TIMESTAMP
);

INSERT INTO authors (name)
VALUES
('J.R.R. Tolkien'),
('George Orwell'),
('Astrid Lindgren'),
('Suzanne Collins');

INSERT INTO books (title, genre, published_year, author_id)
VALUES
('The Hobbit', 'fantasy', 1937, 1),
('1984', 'dystopian', 1949, 2),
('Pippi Longstocking', 'children', 1945, 3),
('The Hunger Games', 'dystopian', 2008, 4);

INSERT INTO members (name)
VALUES
('Alex'),
('Sam');
