import { Router } from "express";
import { addComentarios, findAllComentarios } from "../controllers/comentarios.controllers.js";
import { uploadFiles } from "../middlewares/upload.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = Router();

// Ruta Comentarios
router.get('/', findAllComentarios);
router.post('/', verifyToken, addComentarios);

export default router