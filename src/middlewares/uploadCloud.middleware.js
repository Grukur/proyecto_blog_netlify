import { v2 as cloudinary } from "cloudinary";
import * as path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

cloudinary.config({
    cloud_name: process.env.STORAGE_NAME,
    api_key: process.env.STORAGE_KEY,
    api_secret: process.env.STORAGE_SECRET,
});

export const uploadFilesCloud = (req, res, next) => {
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
        let nombreFoto = `${foto.mimetype.split("/")[0]}`;

        if (!formatosPermitidos.includes(extension)) {
            return res.status(400).json({
                code: 400,
                message: `Formato no permitido ${extension}, formatos permitidos(${formatosPermitidos.join(
                    " - "
                )})`,
            });
        };

        cloudinary.uploader
            .upload_stream({ resource_type: "auto" }, async (error, result) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({
                        code: 500,
                        message:
                            "Error al subir la imagen en proceso de creación de producto.",
                    });
                }
                req.nombreImagen = nombreFoto;
                req.pathImagen = result.url;
                req.imagenId = result.public_id;
                
                next();
            }).end(foto.data);
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ code: 500, message: "Error al procesar solicitud." });
    }
};


export const deleteFileCloud = (imagenId) => {
    cloudinary.uploader.destroy(imagenId, (error, result) =>{
        if (error) {
            return console.log("Error al eliminar la imagen del servicio cloud: ", error);
        }
        console.log(`Imagen con ID: ${imagenId} ha sido eliminada con éxito del servicio cloud.`);
    });
}
