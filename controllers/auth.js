const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/googleVerify");

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuarioDB = await Usuario.findOne({ email });

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "email no encontrado",
      });
    }
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);

    if (!validPassword) {
      return res.status(404).json({
        ok: false,
        msg: "password no valido",
      });
    }

    const token = await generarJWT(usuarioDB.id);

    res.json({
      ok: true,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const googleToken = req.body.token;

  try {
    const { name, email, picture } = await googleVerify(googleToken);

    //crear usuario a partir de googleSingIn
    const usuarioDB = await Usuario.findOne({ email });
    let usuario;

    if (!usuarioDB) {
      //si no existe el usuario en BD
      usuario = new Usuario({
        nombre: name,
        email,
        password: "@@@",
        img: picture,
        google: true,
      });
    } else {
      //existe usuario
      usuario = usuarioDB;
      usuarioDB.google = true;
    }

    //guarda en BBDD
    await usuario.save();

    //Generar TOKEN - JWT
    const token = await generarJWT(usuario.id);
    //-------------------------------------------------

    res.json({
      ok: true,
      token,
    });
  } catch (error) {
    res.status(401).json({
      ok: false,
      err: error,
      msj: "token no es correcto o...",
    });
  }
};

const renewToken = async (req, res) => {
  const _id = req._id;

  //generar el TOKEN JWT
  const token = await generarJWT(_id);

  // obtener usuario por _id
  const usuario = await Usuario.findById(_id);

  res.json({
    ok: true,
    token,
  });
};

module.exports = {
  login,
  renewToken,
  googleSignIn,
};
