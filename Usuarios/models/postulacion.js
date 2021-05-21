const mongoose = require("mongoose");

const PostulacionSchema = mongoose.Schema({
  idtrabajo: {
    type: String,
    trim: true,
  },
  idusuario: {
    type: String,
    trim: true,
  },
  creacion: {
    type: Date,
    default: Date.now(),
  },
  leido: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Postulacion", PostulacionSchema);
