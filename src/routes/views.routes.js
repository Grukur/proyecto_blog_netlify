import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import moment from 'moment';
import Noticias from "../models/Noticias.models.js";
import Usuario from "../models/Usuario.models.js";
const router = Router();

//ruta post usuarios
router.get(["/home", "/"], (req, res) => {
    res.render("home");
});
router.get("/noticias", async (req, res) => {
    let usuario = req.usuario
    let data = await Noticias.findAll({raw:true})
    data = data.map(noticia => {
        noticia.createdAt = moment(noticia.createdAt).format('DD/MM/YYYY h:mm:ss')
        return noticia
    })
    res.render("noticias", {noticias:data, usuario})
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/registro", (req, res) => {
    res.render("registro");
});

router.get("/dashboard", verifyToken, async(req, res) => {
    let data = await Noticias.findAll()
    res.render("dashboard", {noticias:data});
});

router.get("/perfil", verifyToken, async (req, res) => {
    let usuario = req.usuario
    usuario.dataValues.createdAt = moment(usuario.dataValues.createdAt).format('DD/MM/YYYY h:mm:ss')
    res.render("perfil", {usuario});
});
router.get("/subirNoticias", verifyToken, async (req, res) => {
    res.render("subirNoticias");
})

export default router;
