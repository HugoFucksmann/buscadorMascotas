const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  getUsuarios,
  getAllNotificationTokens,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario,
  actLocation,
} = require("../controllers/usuarios");
const router = Router();

router.get("/todos", validarJWT, getUsuarios);
router.get("/notifications", validarJWT, getAllNotificationTokens);
router.post("/", crearUsuario );
//router.put("/:uid", validarJWT, actualizarUsuario);
router.put("/location", actLocation);
router.delete("/", validarJWT, borrarUsuario);

module.exports = router;
