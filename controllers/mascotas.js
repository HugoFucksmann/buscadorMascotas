const Mascota = require("../models/mascotas");

const getMascota = async (req, res = response) => {
  const mascotas = await Mascota.find()
  const total = await Mascota.countDocuments();

  res.json({
    ok: true,
    mascotas,
    total,
  });
};

const crearMascota = async (req, res = response) => {
 
  const uid = req.uid; // se extrae del middleware validarToken
  const mascota = new Mascota({
    usuario: uid,
    ...req.body,
  });

  try {
    const mascotaDB = await mascota.save();

    res.json({
      ok: true,
      mascota: mascotaDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error inesperado, hable con el administrador",
    });
  }
};

const actualizarMascota = async (req, res = response) => {
  const mascotaId = req.params.id;

  const uid = req.uid;

  try {
    const mascotaDB = await Mascota.findById(mascotaId);

    if (!mascotaDB) {
      return res.status(404).json({
        ok: false,
        msg: "mascota no encontrado",
      });
    }

    //mascotaDB.nombre = req.body.nombre;
    const cambiosmascota = {
      ...req.body,
      usuario: uid,
    };

    const mascotaActualizado = await Mascota.findByIdAndUpdate(
      mascotaId,
      cambiosmascota,
      { new: true }
    );

    res.json({
      ok: true,
      mascotaActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error hsble con el admin",
    });
  }
};

const borrarMascota = async (req, res = response) => {
  const mascotaId = req.params.id;

  try {
    const mascotaDB = await Mascota.findById(mascotaId);

    if (!mascotaDB) {
      return res.status(404).json({
        ok: false,
        msg: "mascota no encontrado",
      });
    }

    await Mascota.findByIdAndDelete(mascotaId);

    res.json({
      ok: true,
      msg: "mascota eliminado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error hsble con el admin",
    });
  }
};

module.exports = {
  getMascota,
  crearMascota,
  actualizarMascota,
  borrarMascota,
};

/*
let file 
    if( req.files.imgMascota ){
      file = req.files.imgMascota;
    }else if (req.files.imgU) {
      file = req.files.imgU;
    }else{
      file = null
    }
    const nombreCortado = file.name.split(".");
    const extensionArchivo = nombreCortado[nombreCortado.length - 1]; //capturamos la extencion

    //validar la extension
    const extensionesValidas = ["png", "jpg", "jpeg"];

    if (!extensionesValidas.includes(extensionArchivo)) {
      return res.status(400).json({
        ok: false,
        msg: "No es una extension valida",
      });
    }

    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;
    const path = `./uploads/${tipo}/${nombreArchivo}`; 
    
    file.mv(path, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          ok: false,
          msg: "Error al mover la imagen",
        });
      }
*/