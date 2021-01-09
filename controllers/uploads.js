const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { actualizarImagen } = require("../helpers/actualizar-img");

const fileUploads = (req, res) => {
  const tipo = req.params.tipo;
  const id = req.params.id;

  try {
    //validar tipos
    const tiposValidos = ["imgMascota","imgU"];
   
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({
        ok: false,
        msg: "No es un tipo valido",
      });
    }
    
    //validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        ok: false,
        msg: "no hay ningun archivo subido",
      });
    }
   
    //prosesar la img
    let file // middleware en rutas
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
    console.log(path);
    
    file.mv(path, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          ok: false,
          msg: "Error al mover la imagen",
        });
      }
      
      // Actualizar base de datos
      actualizarImagen(tipo, id, nombreArchivo);

      res.json({
        ok: true,
        msg: "archivo subido con exito",
        nombreArchivo,
      });
    });
    
   
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error que no deberia pasar",
    });
  } 
};

const retornaImagen = (req, res = response) => {
  const tipo = req.params.tipo;
  const nombre = req.params.nombre;

  const pathImg = path.join(__dirname, `../uploads/${tipo}/${nombre}`);

  //imagen por defecto
  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    const pathImg = path.join(__dirname, `../uploads/no-img.png`);

    res.sendFile(pathImg);
  }
};

module.exports = {
  fileUploads,
  retornaImagen,
};
