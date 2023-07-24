import { Router } from "express";
import { addUsuario, login, findAllUsuarios, editUser, changeStatus, deleteUser  } from "../controllers/usuarios.controllers.js";
import { emitToken, verifyToken } from "../middlewares/auth.middleware.js"
const router = Router();



//ruta post usuarios
router.get("/", findAllUsuarios);
router.post("/", addUsuario);
router.post("/login", emitToken, login);
router.put("/",verifyToken, editUser);
router.delete("/",verifyToken, changeStatus);
router.delete("/destroy",verifyToken, deleteUser);

export default router;
