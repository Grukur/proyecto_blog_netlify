import Comentarios from "../models/Comentarios.models.js";
import Noticias from "../models/Noticias.models.js";
import Reacciones from "../models/Reacciones.models.js";
import Usuario from "../models/Usuario.models.js";

export const findAllUsuarios = async (req, res) => {
    try {
        let usuarios = await Usuario.findAll({
            attributes: ["usuarioId", "autor", "email"],
            include: [Noticias, Comentarios, Reacciones],
            where:{status:true},
            order: [['autor', 'ASC']],
        });
        res.json({ code: 200, message: "OK", data: usuarios });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: `Error al consultar los usuarios - error: ${error}`,
        });
    }
};

export const addUsuario = async (req, res) => {
    try {
        let { autor, email, password } = req.body;
        if(password.length < 8){
            return res.status(406).send("La contraseña debe tener minimo 8 caracteres.")
        }
        await Usuario.create({
            autor,
            email,
            password
        });
        res.status(201).json({
            code: 201,
            message: `Se ha creado el usuario ${autor}`,
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: `Error al crear el usuario - error: ${error}`,
        });
    }
};

export const login = async (req, res) => {
    try {
        res.json({ 
            code: 200,
            message: "Login correcto.", 
            token: req.token, 
            usuario:req.usuario, 
            stamp:req.stamp 
        });
    } catch (error) {
        res.status(400).json({
            code: 400,
            message: `Error, usuario no existe al parecer - error: ${error}`,
        });
    }
};

export const editUser = async(req, res) => {
    try{
        let {id} = req.params;
        let { autor, rut, email, password, admin } = req.body;
        let usuario = await Usuario.findByPk(id);

        if(!usuario){
            return res.status(404).json({code:404, message: 'Usuario no encontrado.'})
        }

        await usuario.update(
            {
            autor,
            rut,
            email,
            password,
            admin,
            },
            {where: {id}}
        );
        res.status(201).json({
            code:201,
            message:`Usuario ${usuario.autor} se actualizo con exito.`
        })

    }catch(error){
        res.status(500).send({ 
            code: 500, 
            message: `Usuario con id y autor: ${id} - ${autor} no se pudo editar - error: \n ${error}`
        });
    }
}

export const changeStatus = async (req, res) => {
    try {
      let { id } = req.params;
      let {status} = req.body
      await Usuario.update(
        {status},
        {where: {id}}
        )
      res.status(201).send(`Usuario con id: ${id} ha sido anulado.`)
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: `Usuario con id: ${id} no se pudo anular - error: \n ${error}`
      });
    }
  }

  export const deleteUser = async(req, res) => {
    try {
        let {id} = req.params;
        let usuario = await Usuario.findByPk(id);
        if(!usuario){
            return res.status(404).send('No existe ese usuario');
        }
        let autor = usuario.autor
        await usuario.destroy();

        res.status(200).json({
            code:200,
            message: `usuario con id y autor: ${id} - ${autor} ha sido eliminado.`
        })

    }catch(error){
        res.status(500).send({ 
            code: 500, 
            message: `usuario con id y autor: ${id} - ${autor} no se pudo eliminar - error: \n ${error}`
        });
    }
}
