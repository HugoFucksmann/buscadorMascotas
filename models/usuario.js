const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema(
  {
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
    location: {
      longitude: {
        type: Number,
        default: 0,
      },
      latitude: {
        type: Number,
        default: 0,
      },
    },
  },
  { collection: "usuarios" }
);

//para cambiar algun parametro, config global (ej: _id por id)
UsuarioSchema.method("toJSON", function () {
  const { __v, password, ...Object } = this.toObject();

 
  return Object;
});

module.exports = model("Usuario", UsuarioSchema);
