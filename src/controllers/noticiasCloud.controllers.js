import { deleteFileCloud } from "../middlewares/uploadCloud.middleware.js";
import Usuario from '../models/Usuario.models.js';
import Noticias from '../models/Noticias.models.js';


export const addNoticiasCloud = async (req, res) => {
    //console.log(req.body);
    let { usuarioId } = req.usuario
    let { titulo, texto, categoria } = req.body;
    //req.nombreImagen -> viene desde middleware
    //req.pathImagen ->viene desde middleware
    //req.imagenId -> id de la imagen en cloudinary
    try {
        let usuario = await Usuario.findByPk(usuarioId);

        let noticiaCreada = await Noticias.create({
            titulo,
            autor: usuario.autor,
            texto,
            categoria,
            img: req.nombreImagen,
            rutaImagen: req.pathImagen,
            publicIdImagen: req.imagenId,
        });

        res.status(201).json({
            code: 201,
            message: `Noticia creado con éxito -> id: ${noticiaCreada.noticiaId}, autor: ${noticiaCreada.autor}`
        });
    } catch (error) {
        deleteFileCloud(req.imagenId);
        res.status(500).json({
            code: 500,
            message: `Error al crear noticia en la base de datos - error: ${error}`
        });
    }
};

export const editNoticiasCloud = async (req, res) => {
    try {
        let { id } = req.params;
        let { nombre, descripcion, precio } = req.body;
        let producto = await Noticias.findByPk(id);

        if (!producto) {
            return res.status(404).json({ code: 404, message: 'Producto no encontrado.' })
        }
        if (req.nombreImagen) {
            deleteFileCloud(producto.publicIdImagen)
        } else if (!req.nombreImagen) {
            console.log('no se entrego imagen')
            req.nombreImagen = producto.img,
                req.pathImagen = producto.rutaImagen
        }

        await producto.update(
            {
                nombre,
                descripcion,
                precio: Number(precio),
                img: req.nombreImagen,
                rutaImagen: req.pathImagen,
                publicIdImagen: req.imagenId,
            },
            { where: { id } }
        );
        res.status(201).json({
            code: 201,
            message: `Producto ${producto.nombre} se actualizo con exito.`
        })

    } catch (error) {
        deleteFileCloud(req.imagenId);
        res.status(500).send({
            code: 500,
            message: `producto con id y nombre: ${id} - ${nombre} no se pudo editar - error: \n ${error}`
        });
    }
}

export const deleteNoticiasCloud = async (req, res) => {
    let { id } = req.params;
    let noticia = await Noticias.findByPk(id);
    try {
        if (!noticia) {
            return res.status(404).send('No existe ese noticia');
        }
        deleteFileCloud(noticia.publicIdImagen)
        await noticia.destroy();

        res.status(200).json({
            code: 200,
            message: `noticia con ID: ${id} ha sido eliminado.`
        });
    } catch (error) {
        res.status(500).send({
            code: 500,
            message: `noticia con id y nombre: ${id} - ${nombre} no se pudo eliminar - error: \n ${error}`
        });
    }
}
