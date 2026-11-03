## GET /authors/1/books

Sequelize

```sql
SELECT "Author"."id", "Author"."name", "Books"."id" AS "Books.id", "Books"."title" AS "Books.title", "Books"."genre" AS "Books.genre", "Books"."published_year" AS "Books.published_year", "Books"."author_id" AS "Books.author_id" FROM "authors" AS "Author" LEFT OUTER JOIN "books" AS "Books" ON "Author"."id" = "Books"."author_id" WHERE "Author"."id" = '1' ORDER BY "Books"."id" ASC;  
```


```sql
SELECT books.*, authors.name AS author_name
FROM books
JOIN authors ON books.author_id = authors.id
WHERE authors.id = 1
ORDER BY books.id ASC;
```

## GET /members/1/loans

Sequelize

```sql
SELECT "Member"."id", "Member"."name", "Books"."id" AS "Books.id", "Books"."title" AS "Books.title", "Books"."genre" AS "Books.genre", "Books"."published_year" AS "Books.published_year", "Books"."author_id" AS "Books.author_id", "Books->Loan"."id" AS "Books.Loan.id", "Books->Loan"."loan_date" AS "Books.Loan.loan_date", "Books->Loan"."returned_at" AS "Books.Loan.returned_at" FROM "members" AS "Member" LEFT OUTER JOIN ( "loans" AS "Books->Loan" INNER JOIN "books" AS "Books" ON "Books"."id" = "Books->Loan"."book_id") ON "Member"."id" = "Books->Loan"."member_id" WHERE "Member"."id" = '1';
```


```sql
SELECT members.id, members.name, books.id AS book_id, books.title, loans.loan_date, loans.returned_at
FROM members
JOIN loans ON loans.member_id = members.id
JOIN books ON books.id = loans.book_id
WHERE members.id = 1;
```

## Does Sequelize use INNER JOIN or LEFT OUTER JOIN for include? Why?

LEFT OUTER JOIN, so the row comes back if nothing is connected to it.

## What is different between its SQL and yours?

Sequelize names tables after the models.
