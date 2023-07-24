import * as path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));


export const uploadFiles = (req, res, next) => {
    try {
        console.log('uploading....')
        let foto = req.files.foto;
        let size = foto.size;
        if(size > 2000000){
            return res.status(400).json({
                code: 400,
                message: `Tamaño no permitido, Tamaño maximo permitido 2MB`,
            });
        }
        let formatosPermitidos = ["jpeg", "png", "webp", "gif", "svg"];
        let extension = `${foto.mimetype.split("/")[1]}`;

        if (!formatosPermitidos.includes(extension)) {
            return res.status(400).json({
                code: 400,
                message: `Formato no permitido ${extension}, formatos permitidos(${formatosPermitidos.join(
                    " - "
                )})`,
            });
        }
        let nombreFoto = `${Date.now()}-img.${extension}`;
        let pathDestino = path.resolve(__dirname, "../../public/uploads/" + nombreFoto);

        foto.mv(pathDestino, async (error) => {
            if (error) {
                console.log(error);
                return res.status(500).json({
                    code: 500,
                    message:
                        "Error al subir la imagen en proceso de creación de producto.",
                });
            }

            req.nombreImagen = nombreFoto;
            req.pathImagen = pathDestino;
            console.log('upload finish.')
            next();
        });


    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ code: 500, message: "Error al procesar solicitud." });
    }
};

export const editFiles = (req, res, next) => {
    try {
        let pathBasic = path.resolve(__dirname, "../../public/uploads/")
        
        if(req.files == null){
            console.log('no file')
            req.pathBasic = pathBasic;
            return next()
        }
        let foto = req.files.foto;
        let formatosPermitidos = ["jpeg", "png", "webp", "gif", "svg"];
        let extension = `${foto.mimetype.split("/")[1]}`;

        if (!formatosPermitidos.includes(extension)) {
            return res.status(400).json({
                code: 400,
                message: `Formato no permitido ${extension}, formatos permitidos(${formatosPermitidos.join(
                    " - "
                )})`,
            });
        }
        let nombreFoto = `${Date.now()}-img.${extension}`;
        let pathDestino = pathBasic + '/' + nombreFoto;

        foto.mv(pathDestino, async (error) => {
            if (error) {
                console.log(error);
                return res.status(500).json({
                    code: 500,
                    message:
                        "Error al subir la imagen en proceso de creación de producto.",
                });
            }

            req.nombreImagen = nombreFoto;
            req.pathImagen = pathDestino;
            req.pathBasic = pathBasic;
            console.log('si file')
            next();
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ code: 500, message: "Error al procesar solicitud." });
    }
};


