const { Schema, model } = require("mongoose");

const getFecha = () => {
  return new Date().getTime(); /* .toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }); */
};

const MascotaSchema = Schema(
  {
    petName: {
      type: String,
    },
    notification: {
      type: String,
      required: true,
    },
    petPicture: {
      type: String,
    },
    petSize: {
      type: String,
    },
    petSex: {
      type: String,
    },
    petDescription: {
      type: String,
    },
    petColor: {
      type: String,
    },
    location: {
      longitude: {
        type: Number,
      },
      latitude: {
        type: Number,
      },
    },
    usuario: {
      type: String,
      require: true,
    },
    date: {
      type: String,
      default: getFecha(),
      required: true,
    },
  },
  { collection: "mascotas" }
);

MascotaSchema.method("toJSON", function () {
  const { __v, ...Object } = this.toObject();

  return Object;
});

module.exports = model("Mascota", MascotaSchema);
