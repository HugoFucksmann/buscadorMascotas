const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  img: {
    type: String,
  },
  google: {
    type: Boolean,
    default: false,
  },
  notification: {
    type: String,
    unique: true,
  },
});

//para cambiar algun parametro, config global (ej: _id por id)
UsuarioSchema.method("toJSON", function () {
  const { __v, password, email,  ...Object } = this.toObject();

 
  return Object;
});

module.exports = model("Usuario", UsuarioSchema);
