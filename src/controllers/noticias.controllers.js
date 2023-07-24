import Noticias from "../models/Noticias.models.js";
import Usuario from "../models/Usuario.models.js";
import Comentarios from '../models/Comentarios.models.js';
import Reacciones from '../models/Reacciones.models.js';
import {Sequelize, literal} from "sequelize";

import fs from "fs";

export const findAllNoticias = async (req, res) => {
    try {
        let noticia = await Noticias.findAll({
            attributes: ['noticiaId', 'titulo', 'autor', 'texto', 'categoria',],
            include: [
                 {model: Comentarios, attributes:['autor', 'usuarioId', 'texto']},
                 {model: Reacciones, attributes:['autor', 'usuarioId', 'like', 'dislike']}
            ],
            where: { status: true },
            order: [['createdAt', 'DESC']],
        });
        res.json({ code: 200, message: "OK", data: noticia });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            code: 500,
            message: `Error al consultar las noticias. - error: ${error}`,
        });
    }
};

export const addNoticias = async (req, res) => {
    try {
        let {usuarioId} = req.usuario
        let { titulo, texto, categoria } = req.body;
        //req.nombreImagen -> viene desde upload.middleware
        //req.pathImagen ->viene desde upload.middleware

        //buscamos un usuario con id intregado para luego asociarlo en la creacion de noticia
        let usuario = await Usuario.findByPk(usuarioId);

        if (!usuario) {
            return res.status(403).json({
                message: `Error al crear noticia, no se pudo encontrar usuario con ID: ${usuarioId}`
            });
        }
        let noticiaCreada = await Noticias.create({
            titulo,
            autor: usuario.autor,
            texto,
            categoria,
            img: req.nombreImagen,
            rutaImagen: req.pathImagen,
            publicIdImagen: 0,
        });

        await usuario.addNoticias(noticiaCreada)

        res.status(201).json({
            code: 201,
            message: `Noticia creado con éxito -> id: ${noticiaCreada.noticiaId}, autor: ${noticiaCreada.autor}`
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: `Error al crear noticia en la base de datos - error: ${error}`
        });
    }
};
