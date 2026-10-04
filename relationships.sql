

-- 1


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    avatar_url VARCHAR(255)
);

-- Insert sample rows
INSERT INTO users (username, email) VALUES
('knatte', 'knatte@example.com'),
('fnatte', 'fnatte@example.com'),
('latte', 'latte@example.com');

INSERT INTO profiles (user_id, bio, avatar_url) VALUES
(1, 'Software developer', 'https://example.com/knatte.jpg'),
(2, 'Designer', 'https://example.com/fnate.jpg');

-- SELECT with JOIN: show users connected with their profile
SELECT u.id AS user_id, u.username, u.email, p.bio, p.avatar_url
FROM users u
JOIN profiles p ON u.id = p.user_id;


-- 2

CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE CASCADE
);

-- Insert sample rows
INSERT INTO authors (name) VALUES
('J.R.R. Tolkien'),
('George R.R. Martin');

INSERT INTO books (title, author_id) VALUES
('The Hobbit', 1),
('The Fellowship of the Ring', 1),
('The Two Towers', 1),
('A Game of Thrones', 2),
('A Clash of Kings', 2);


SELECT a.name AS author_name, b.title AS book_title
FROM authors a
JOIN books b ON a.id = b.author_id
ORDER BY a.name, b.title;


-- ERROR: insert or update on table "books" violates foreign key constraint "books_author_id_fkey"
-- DETAIL: Key (author_id)=(999) is not present in table "authors".
--
-- It happend because the key constraint books_author_id_fkey most have a valid key.



-- 3.

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL
);

CREATE TABLE student_courses (
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    PRIMARY KEY (student_id, course_id)
);

-- Insert sample rows
INSERT INTO students (name) VALUES
('Emma Watson'),
('Daniel Radcliffe'),
('Rupert Grint');

INSERT INTO courses (title) VALUES
('Potions'),
('Defense Against the Dark Arts'),
('Transfiguration');

INSERT INTO student_courses (student_id, course_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 2),
(2, 3),
(3, 1);


SELECT s.name AS student_name, c.title AS course_title
FROM students s
JOIN student_courses sc ON s.id = sc.student_id
JOIN courses c ON sc.course_id = c.id
ORDER BY s.name, c.title;


-- ERROR: duplicate key value violates unique constraint "student_courses_pkey"
-- DETAIL: Key (student_id, course_id)=(1, 1) already exists.
--
-- Every student most have its pair of keys.
