const fs = require("fs");
const Mascota = require("../models/mascotas");

const borrarImagen = (path) => {
  if (fs.existsSync(path)) {
    //borrar la img anterior
    fs.unlinkSync(path);
  }
};
//al ser async devuelve promesa
const actualizarImagen = async (tipo, id, nombreArchivo) => {
  let pathViejo = "";
  const mascota = await Mascota.findById(id);
  if (!mascota) {
    console.log("no se encontro mascota con ese id");
    return false;
  }

  switch (tipo) {
    case "mascota":
      pathViejo = `../uploads/mascota/${mascota.petPicture}`;

      borrarImagen(pathViejo);

      mascota.petPicture = nombreArchivo;
      await mascota.save();
      return true;

      break;
  }
};

module.exports = {
  actualizarImagen,
};
