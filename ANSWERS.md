## 1.

Sequelize translates between JavaScript and SQL. So manual SQL string building is not needed. 

## 2.

ORM stands for Object Relational Mapping. The object part is the different type of objects in the program and mapping is rules that connects the different objects to a database. Relational refers to the relational database.

## 3.


`Book.findAll()`:

```sql
SELECT "id", "title", "genre", "publishedYear", "createdAt", "updatedAt"
FROM "Books" AS "Book";
```

`Book.findByPk(3)`:

```sql
SELECT "id", "title", "genre", "publishedYear", "createdAt", "updatedAt"
FROM "Books" AS "Book"
WHERE "Book"."id" = 3;
```

## 4.
- host is were the db is running for example localhost.
- port is the port number the database is listening on.
- dialect tells Sequelize which kind of database it is talking to.
- logging tells Sequelize to print the SQL it generates.

## 5.

sequelize.sync() creates a table for each model that doesn't have one yet and leaves existing tables alone. sync({ force: true }) drops every table and recreates them empty, which deletes all the rows, database with real data would wipe everything.

## 6.

Plain SQL can be better for complex operations or for some operations that the friction of the ORM negatively effect performance.

An ORM makes everything easier but does not have the same flexibility as raw SQL. It also is extra friction for an db operation with a extra step in between.


## why does the loan date belong in the loans table, and not in books or members?

Because this is an event that involves both a member and a book.