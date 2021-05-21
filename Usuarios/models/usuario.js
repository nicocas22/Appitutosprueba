const mongoose = require("mongoose");

const UsuariosSchema = mongoose.Schema({
  nombres: {
    type: String,
    trim: true,
  },
  fechaNacimiento: {
    type: Date,
  },
  rut: { type: String },
  direccion: {},
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
  },
  telefono: {
    type: String,
  },
  trabajos: [],
  valoTrabajador: [
    {
      id: String,
      idPostulacion: String,
      idEmpleador: String,
      nombre: String,
      valoracion: Number,
      desc: String,
      creacion: { type: Date, default: Date.now() },
    },
  ],
  valoEmpleador: [
    {
      id: String,
      idPostulacion: String,
      idTrabajador: String,
      valoracion: Number,
      desc: String,
      creacion: { type: Date, default: Date.now() },
    },
  ],
  intereses: [],
  perfilURL: {
    type: String,
    trim: true,
  },
  favoritos: [],
  activo: {
    type: Number,
    default: 0,
  },
});

UsuariosSchema.methods.setperfilURL = function setperfilURL(filename) {
  this.perfilURL = `https://appitutosprueba.azurewebsites.net/public/${filename}`;
};

module.exports = mongoose.model("Usuario", UsuariosSchema);
