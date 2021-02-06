const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require("../controllers/usuarios");
const router = Router();

router.get("/", validarJWT, getUsuarios);
router.post("/", crearUsuario );
router.put("/:uid", validarJWT, actualizarUsuario);
router.delete("/", validarJWT, borrarUsuario);

module.exports = router;

/*
 [check("notification", "no lleva notificaciones").notEmpty(), validarCampos],
*/