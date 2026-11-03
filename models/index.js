import Author from "./Author.js";
import Book from "./Book.js";
import Member from "./Member.js";
import Loan from "./Loan.js";

Author.hasMany(Book, { foreignKey: "author_id" });
Book.belongsTo(Author, { foreignKey: "author_id" });

Member.belongsToMany(Book, { through: Loan, foreignKey: "member_id", otherKey: "book_id" });
Book.belongsToMany(Member, { through: Loan, foreignKey: "book_id", otherKey: "member_id" });

export { Author, Book, Member, Loan };