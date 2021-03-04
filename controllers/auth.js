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
  const user = req.body.user;  
  try {
    const { name, email, picture } = await googleVerify(googleToken);
    
    //crear usuario a partir de googleSingIn
    const usuarioDB = await Usuario.findOne({ email });
    let usuario;

    if (usuarioDB) {
      usuario = usuarioDB;
    } else {
      usuario = await Usuario.findByIdAndUpdate(
        user._id,
        { name, email, img: picture, google: true },
        {
          new: true,
        }
      );
    }
       
    const token = await generarJWT(usuario._id);

    res.json({
      ok: true,
      usuario,
      token
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
  
  const _id = req.body.id;
  let userr
  try {
    userr = await Usuario.findById(_id);
    
    if(!userr) {
      return res.status(400).json({
        ok: false,
        msg: 'no existe usuario'
      })
    }
    const token = await generarJWT(_id);
    
   
    return res.json({
      ok: true,
      token,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      ok: false,
      msg: "error al generar retoken",
    });
  }
};

module.exports = {
  login,
  renewToken,
  googleSignIn,
};
