import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";


const Noticias = sequelize.define(
    "noticias",
    {
        noticiaId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        titulo: {
            type: DataTypes.STRING(60),
            allowNull: false,
        },
        texto: {
            type: DataTypes.STRING(4000),
            allowNull: false,
        },
        autor: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        categoria: {
            type: DataTypes.ENUM('Ambiente', 'Tecnologia', 'Deporte', 'Politica'),
            allowNull: false,
        },
        likes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        noLikes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        img: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rutaImagen: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        publicIdImagen: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
        timestamps: true,
    }
);

export default Noticias;