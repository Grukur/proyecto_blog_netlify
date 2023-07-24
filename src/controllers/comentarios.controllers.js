import Comentarios from "../models/Comentarios.models.js";
import Noticias from "../models/Noticias.models.js";
import Usuario from "../models/Usuario.models.js";
import fs from "fs";

export const findAllComentarios = async (req, res) => {
    try {
        let comentario = await Comentarios.findAll({
            attributes: { exclude: ["createdAt", "updatedAt", 'usuarioUsuarioId', 'noticiaNoticiaId', 'noticia'] },
            include: [{model:Noticias, attributes:['titulo', 'autor']}],
            where: { status: true },
            order: [['noticiaId', 'DESC']],
        });
        res.json({ code: 200, message: "OK", data: comentario });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: `Error al consultar los comentarios. - error: ${error}`,
        });
    }
};

export const addComentarios = async (req, res) => {
    try {
        let { texto, usuarioId, noticiaId } = req.body;
        //req.nombreImagen -> viene desde middleware
        //req.pathImagen ->viene desde middleware

        let usuario = await Usuario.findByPk(usuarioId);
        let noticia = await Noticias.findByPk(noticiaId);

        if (!usuario || !noticia) {
            return res.status(403).send(`Usuario o Noticia no existe`);
        }

        let comentarioCreado = await Comentarios.create({
            texto,
            autor: usuario.autor
        });

        await usuario.addComentarios(comentarioCreado);
        await noticia.addComentarios(comentarioCreado);

        res.status(201).json({
            code: 201,
            message: `Comentarios creado con éxito -> id: ${comentarioCreado.id}`
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: "Error al crear comentario en la base de datos. " + error,
        });
    }
};
