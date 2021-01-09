const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  telefono: {
    type: Number,
  },
  img: {
    type: String,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

//para cambiar algun parametro, config global (ej: _id por id)
UsuarioSchema.method("toJSON", function () {
  const { __v, _id, password, ...Object } = this.toObject();

  Object.uid = _id;
  return Object;
});

module.exports = model("Usuario", UsuarioSchema);
