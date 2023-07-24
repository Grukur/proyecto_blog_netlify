import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";


const Comentarios = sequelize.define(
    "comentarios",
    {
        comentarioId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        autor: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        texto: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
    },
    {
        timestamps: true,
    }
);

export default Comentarios;