const { response } = require("express");
const bcrypt = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");


const getUsuarios = async (req, res) => {
 
  const notification = req.body.notification;
  const existeUsu = await Usuario.findOne({ notification }); //* promesa

  if (existeUsu) {
    return res.status(400).json({
      ok: true,
      msg: "El usuario ya esta registrado",
    });
  }
 
 
  /* const desde = Number(req.query.desde) || 0;

  const [usuarios, total] = await Promise.all([
    Usuario.find({}, "nombre email telefono google img").skip(desde).limit(5),

    Usuario.countDocuments(),
  ]);

  res.json({
    ok: true,
    usuarios,
    total,
    
  }); */
  
};

const crearUsuario = async (req, res = response) => {
  const { notification } = req.body.user;
  try {
    const existeUsu = await Usuario.findOne({ notification }); 
    
    if (existeUsu) {
      return res.json({
        ok: true,
        user: existeUsu
      });
    }
    const user = new Usuario(req.body.user);

    //* Encriptar contrasegna
    //const salt = bcrypt.genSaltSync(12);
    //usuario.password = bcrypt.hashSync(password, salt);

    //* guarda usuario
    await user.save();
    
    //Generar TOKEN - JWT
    //const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      user
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado...",
    });
  }
};

const actualizarUsuario = async (req, res = response) => {
  const uid = req.params.uid;

  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario para ese id",
      });
    }
    
    const { password, email, google, ...campos } = req.body;

    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    });
    res.json({
      ok: true,
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperadoo",
    });
  }
};

const borrarUsuario = async (req, res = response) => {
  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario para ese id",
      });
    }

    await Usuario.findByIdAndDelete(uid);

    res.json({
      ok: true,
      msg: "usuario borrado",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "error al elimiar usuario",
    });
  }
};

module.exports = {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario,
};
