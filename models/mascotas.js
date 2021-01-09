const { Schema, model } = require("mongoose");

const getFecha = () => {
  return new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const MascotaSchema = Schema(
  {
    petName: {
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
      unique: true,
    },
    petType: {
      type: String,
    },
    petColor: {
      type: String,
    },
    petSpots: {
      type: String,
    },
    locationLost: {
      longitude: {
        type: [Number],
      },
      latitude: {
        type: [Number],
      },
    },
    locationFound: {
      longitude: {
        type: [Number],
      },
      latitude: {
        type: [Number],
      },
    },
    petState: {
      type: String,
    },
    recovered: {
      type: Boolean,
    },
    petRetained: {
      type: Boolean,
    },
    usuario: {
      require: true,
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
    date: {
      type: String,
      default: getFecha(),
      required: true
    },
  },
  { collection: "mascotas" }
);

MascotaSchema.method("toJSON", function () {
  const { __v, ...Object } = this.toObject();

  return Object;
});

module.exports = model("Mascota", MascotaSchema);
