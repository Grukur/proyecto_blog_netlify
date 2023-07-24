import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";


const Reacciones = sequelize.define(
    "reacciones",
    {
        like: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: "reacciones",
        timestamps: true,
    }
);

export default Reacciones;
