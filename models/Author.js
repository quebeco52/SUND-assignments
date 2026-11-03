import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Author = sequelize.define(
    "Author",
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
    },
    { tableName: "authors", timestamps: false }
);

export default Author;