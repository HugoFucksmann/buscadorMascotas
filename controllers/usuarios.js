const { response } = require("express");
const bcrypt = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");


const getUsuarios = async (req, res) => {
  const desde = Number(req.query.desde) || 0;

  // {} para aplicar filtros
  /*const usuarios = await Usuario
                            .find( {}, 'nombre email role google' )
                            .skip( desde )
                            .limit( 5 );

    const total = await Usuario.count();*/
  //otra forma propia de js
  const [usuarios, total] = await Promise.all([
    Usuario.find({}, "nombre email telefono google img").skip(desde).limit(5),

    Usuario.countDocuments(),
  ]);

  res.json({
    ok: true,
    usuarios,
    total,
    //uid: req.uid //id del usuario que realiza la peticion
  });
};

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email }); //* promesa

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya esta registrado",
      });
    }

    const usuario = new Usuario(req.body);

    //* Encriptar contrasegna
    const salt = bcrypt.genSaltSync(12);
    usuario.password = bcrypt.hashSync(password, salt);

    //* guarda usuario
    await usuario.save();

    //Generar TOKEN - JWT
    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      usuario,
      token,
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
