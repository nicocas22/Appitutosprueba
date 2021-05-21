const mongoose = require("mongoose");

const TrabajosSchema = mongoose.Schema({
  idusuario: { type: String },
  titulo: {
    type: String,
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
  },
  salario: {
    type: String,
    trim: true,
  },
  categoria: {
    type: String,
    trim: true,
  },
  direccion: {},
  telefono: {
    type: String,
    trim: true,
  },

  metodoPago: {
    type: String,
    trim: true,
  },
  fechaTermino: {
    type: Date,
  },
  visible: {
    type: Number,
    defaultValue: 0,
  },
  idContratado: {
    type: String,
    default: null,
  },
  galeriaURL: [],
  beneficios: [],
  tags: [],
  contratoURL: [],
  creacion: { type: Date, default: new Date() },
  fechaTermino: {},
  estado: { type: String, default: "activo" },
  promocion: {},
  idPost: {},
  postulaciones: [],
});

module.exports = mongoose.model("Trabajos", TrabajosSchema);
