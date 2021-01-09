const { Router } = require("express");
const fileUpload = require("express-fileupload");
const { validarJWT } = require("../middlewares/validar-jwt");
const { fileUploads, retornaImagen } = require("../controllers/uploads");

const router = Router();

router.use(fileUpload());

router.put("/:tipo/:id", validarJWT, fileUploads);

router.get("/:tipo/:nombre", retornaImagen);

module.exports = router;
