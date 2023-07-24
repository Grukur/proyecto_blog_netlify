import Noticias from "../models/Noticias.models.js";
import Reacciones from "../models/Reacciones.models.js";
import Usuario from "../models/Usuario.models.js";
import { Sequelize, Op } from "sequelize";
import fs from "fs";

export const findAllReacciones = async (req, res) => {
    try {
        const reaccion = await Reacciones.findAll({
            attributes: [
                'noticiaId',
                'usuarioId',
                [Sequelize.literal('SUM(CASE WHEN "like" THEN 1 ELSE 0 END)'), 'likes'],
                [Sequelize.literal('SUM(CASE WHEN "dislike" THEN 1 ELSE 0 END)'), 'dislikes'],
            ],
            include: [
                { model: Noticias, attributes: [] }
            ],
            where: { status: true },
            group: ['reacciones.noticiaId', 'reacciones.usuarioId'],
            order: [['noticiaId', 'DESC']],
        });

        res.json({ code: 200, message: "OK", data: reaccion });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: `Error al consultar las reacciones. - error: ${error}`,
        });
    }
};

export const addLike = async (req, res) => {
    let usuario = req.usuario.toJSON();
    let { noticiaId } = req.params;
    try {  

        let [ reaccion, created ] = await Reacciones.findOrCreate({
            where: { noticiaId: noticiaId,  usuarioId: usuario.id },
            defaults: {
                usuarioId: usuario.id,
                noticiaId,
                like: true,
            },
        });

        let message;

        if (created) {
            message = 'Like guardado con exito!'
        } else {
            if(reaccion.like){     
                message = 'Like eliminado con exito!'           
                await reaccion.destroy();
            }
            reaccion.update({
                like: true
            })
            message = 'Like modificado con exito!'
            
        };
        res.status(201).json({ code: 201, message })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            code: 500,
            message: "Error al crear reaccion en la base de datos. ",
        });
    }
};

export const addDislike = async (req, res) => {
    let usuario = req.usuario;
    let { noticiaId } = req.params;
    try {
        
        let { reaccion, created } = await Reacciones.findOrCreate({
            where: { noticiaId: noticiaId,  usuarioId: usuario.id },
            defaults: {
                usuarioId: usuario.id,
                noticiaId,
                like: false,
            },
        });
        console.log('resultado ', reaccion,' ', created)
        if (created) {
            await usuario.addReacciones(created);
            await noticia.addReacciones(created);
            res.status(201).json({ code: 201, message: 'Dislike guardado con exito!' })
        } else {
            if(!reaccion.like){                
                await reaccion.destroy();
            }
            await usuario.addReacciones(reaccion);
            await noticia.addReacciones(reaccion);
            reaccion.update({
                like: false
            });
            res.status(201).json({ code: 201, message: 'Ahora se dió dislike!' })
        };

    } catch (error) {
        console.log(error)
        res.status(500).json({
            code: 500,
            message: "Error al crear reaccion en la base de datos. " + error,
        });
    }
};

/* export const editReacciones = async(req, res) => {
    try{
        let {id} = req.params;
        let { nombre, descripcion, precio } = req.body;
        let reaccion = await Reacciones.findByPk(id);

        if(!reaccion){
            return res.status(404).json({code:404, message: 'reaccion no encontrado.'})
        }
        if(req.nombreImagen){
            fs.unlinkSync(req.pathBasic + '/' + reaccion.img)
        }else if(!req.nombreImagen){
            console.log('no se entrego imagen')
            req.nombreImagen = reaccion.img,
            req.pathImagen = reaccion.rutaImagen
        }
        await reaccion.update(
            {
            nombre,
            descripcion,
            precio: Number(precio),
            img: req.nombreImagen,
            rutaImagen: req.pathImagen,
            publicIdImagen: 0,
            },
            {where: {id}}
        );
        res.status(201).json({
            code:201,
            message:`Reacciones ${reaccion.nombre} se actualizo con exito.`
        })

    }catch(error){
        fs.unlinkSync(req.pathImagen);
        console.log(req.pathImagen + ' fs exitoso')
        res.status(500).send({ 
            code: 500, 
            message: `Reacciones no se pudo editar - error: \n ${error}`
        });
    }
}

export const changeStatus = async (req, res) => {
    try {
      let { id } = req.params;
      let {status} = req.body
      await Reacciones.update(
        {status},
        {where: {id}}
        )
      res.status(201).json(`Reacciones con id: ${id} ha sido anulado/activado: ${status}.`)
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: `Reacciones no se pudo anular - error: \n ${error}`
      });
    }
  }

export const deleteReacciones = async(req, res) => {
    try {
        let {id} = req.params;
        let reaccion = await Reacciones.findByPk(id);
        if(!reaccion){
            return res.status(404).send('No existe ese reaccion');
        }
        let nombre = reaccion.nombre
        fs.unlinkSync(req.pathBasic + '/' + reaccion.img)
        await reaccion.destroy();

        res.status(200).json({
            code:200,
            message: `Reacciones con id: ${id} y nombre: ${nombre} - ha sido eliminado.`
        })

    }catch(error){
        res.status(500).send({ 
            code: 500, 
            message: `Reacciones no se pudo eliminar - error: \n ${error}`
        });
    }
}
 */