import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.models.js";

export const emitToken = async (req, res, next) => {
    let { email, password } = req.body;
    let usuario = await Usuario.findOne({
        where: { email, password },
        attributes: ["usuarioId", "autor", "email", "createdAt"],
    });

    if (!usuario) {
        return res
            .status(400)
            .json({ code: 400, message: "Error de autentificación."});
    }
    let exp = Math.floor(Date.now() / 1000) + 60 * 30
    let token = jwt.sign(
        {
            exp: exp,
            data: usuario,
        },
        process.env.PASSWORD_SECRET
    );
    const expTimestamp = exp;    

    req.token = token;
    req.usuario = usuario
    req.stamp = expTimestamp

    console.log('Token given')
    next();
};

export const verifyToken = (req, res, next) => {
    try {
        console.log('verificando token....')
        let { token } = req.query;
        if (!token) {
            token = req.headers.authorization;
            if (!token) {
                let msg = ("ruta protegida, debe proporcionar un token de acceso.")
                return redirectLogin(res, msg)
            }
            if (token.length == 0) {
                throw new Error("No se ha proporcionado un token");
            }
        }
        jwt.verify(
            token,
            process.env.PASSWORD_SECRET,
            async (error, decoded) => {
                if (error) {
                    let msg = ("debe proporcionar un token válido / su token puede estar expirado.")
                    return redirectLogin(res, msg)
                }

                try {
                    let usuario = await Usuario.findByPk(decoded.data.usuarioId, {
                        attributes: ["usuarioId", "autor", "email", 'createdAt'],
                    });
                    if (!usuario) {
                        let msg = ("Usuario ya no existe en el sistema.")
                        return redirectLogin(res, msg)
                    }
                    
                    req.usuario = usuario;            
                    console.log('Token: verificado con exito')
                    next();
                } catch (error) {
                    res.status(500).json({ code: 500, message: "Error en autentificación." })
                }
            }
        );
    } catch (error) {
        return res.status(401).json({
            code: 401,
            message: error.message,
        });
    }
};

const redirectLogin = (res) => {
    setTimeout(() => {
        res.redirect("http://localhost:3000/login")
    })
};