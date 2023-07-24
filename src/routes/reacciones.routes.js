import { Router } from "express";
import { findAllReacciones, addLike, addDislike } from "../controllers/reacciones.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = Router();

//ruta reacciones
router.get("/", findAllReacciones);
router.post("/like/:noticiaId", verifyToken, addLike);
router.post("/dislike/:noticiaId", verifyToken, addDislike);
//router.put("/:id", verifyToken, editFiles, editReacciones);
//router.delete("/:id", verifyToken, changeStatus);
//router.delete("/destroy/:id", verifyToken, editFiles, deleteReacciones);


export default router;
