const { Router } = require("express");
const { check } = require("express-validator");
const fileUpload = require("express-fileupload");

const { getMascota, crearMascota, actualizarMascota, borrarMascota, getMiMascota } = require("../controllers/mascotas");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.get("/", getMascota);

router.get("/:id", getMiMascota);

router.post("/",validarJWT, crearMascota); 

router.put("/:id", validarJWT, actualizarMascota);

router.delete("/:id", validarJWT, borrarMascota);



module.exports = router;
