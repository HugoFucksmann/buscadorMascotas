const fetch = require("node-fetch");
const Mascota = require("../models/mascotas");
const Usuario = require("../models/usuario");

const getMascota = async (req, res) => {
  const id = req.params.idUser;

  let mascotas = await Mascota.find()
  const usuario = await Usuario.findById(id);
  //const total = await Mascota.countDocuments();

  try {

     if (mascotas.length === 0) mascotas = false;
    
      
      /*  await mascotas.filter((mascota) => {
       
         let petLat = parseFloat(mascota.location.latitude);
         let petLon = parseFloat(mascota.location.longitude);

          

         let userLat = parseFloat(usuario.location.latitude);
         let userLong = parseFloat(usuario.location.longitude);



         return (petLat - userLat) ** 2 + (petLon - userLong) ** 2 < 0.1;         
       }); */

       await mascotas.sort((a,b) => {
          let userLat = parseFloat(usuario.location.latitude);
          let userLong = parseFloat(usuario.location.longitude);

          let petLatU = parseFloat(a.location.latitude);
          let petLonU = parseFloat(a.location.longitude);
          let petU = petLatU - userLat + (petLonU - userLong);

          let petLatD = parseFloat(b.location.latitude);
          let petLonD = parseFloat(b.location.longitude);
          let petD = petLatD - userLat + (petLonD - userLong);
     
          return petD - petU
       })
 
     res.json({
       ok: true,
       mascotas,
     });
    
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: 'error hable con el admin'
    })
  }
  
 
};

const getMiMascota = async (req, res = response) => {
  const uid = req.params.id

  const miMascota = await Mascota.findOne({ uid });

  try {
    res.json({
      ok: true,
      miMascota,
    });
  } catch (error) {
    console.log(error);
     res.status(400).json({
       ok: false,
       msj: "no tienes mascota perdida",
     });
  }
};

const crearMascota = async (req, res = response) => {
 
  const uid = req.uid; // se extrae del middleware validarToken
 
  const mascota = new Mascota({
    usuario: uid,
    notification: req.body.notification,
    ...req.body.perro,
  });

  try {
    const mascotaDB = await mascota.save();
    const usuarios = await Usuario.find();
    
    const messages = usuarios.map((usuario) => {
      if(usuario.notification){
         return {
           to: usuario.notification,
           sound: "default",
           title: "se perdio un perrito !!",
           body: "entra a verlo para estar atento",
         };
      } 
     
    });
    
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
    })
    
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
  getMiMascota,
};