const Postulacion = require("../models/postulacion");
const Trabajo = require("../models/trabajos");
const Usuario = require("../models/usuario");

exports.crearPostulacion = async (req, res) => {
  const { idtrabajo, idusuario } = req.body;

  try {
    const _postulacion = await Postulacion.findOne({
      $and: [{ idtrabajo: idtrabajo }, { idusuario: idusuario }],
    });

    if (_postulacion) {
      throw new Error("Postulacion ya existe");
      return;
    }

    const postulacion = new Postulacion(req.body);
    const post = await postulacion.save();

    const id = postulacion.idtrabajo;
    let data = await Trabajo.findById(id);
    data.idPost = post._id;
    res.status(200).json(data);

    // const iduser = postulacion.idusuario;
    // const datauser = await Usuario.findById(iduser);
    // const email = datauser.email;
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Postulacion Cancelada Error en el servidor" });
  }
};
const datatrabajos = async (data) => {
  let postulaciones = [];
  for (let i = 0; i < data.length; i++) {
    let trabajo = await Trabajo.findById(data[i].idtrabajo);
    if (trabajo) {
      trabajo.idPost = data[i]._id;

      postulaciones.push(trabajo);
    } else {
      postulaciones.push(data[i]);
    }
  }
  return postulaciones;
};
//OBTENER POSTULACIONES
exports.obtenerPostulaciones = async (req, res) => {
  const idusuario = req.params.id;

  try {
    const postulaciones = await Postulacion.find({
      idusuario: idusuario,
    }).sort({ creacion: -1 });

    const data = await datatrabajos(postulaciones);

    res.send(data);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor." });
    res.end();
  }
};

exports.obtenertrabajosCount = async (req, res) => {
  const iduser = req.params.id;
  try {
    const totalusers = await trabajos
      .find({ idusuario: iduser })
      .countDocuments();
    return res.status(200).json(totalusers);
  } catch (error) {
    console.log(error);
  }
};

exports.deletePostulacion = async (req, res) => {
  const idpostulacion = req.params.idpostulacion;
  try {
    const postulacion = await Postulacion.findById(idpostulacion, (err) => {
      if (err) res.status(402).json({ msg: `Error al borrar postulación` });
    });
    await postulacion.remove((err) => {
      if (err) res.status(402).json({ msg: `Error al borrar el trabajo ` });
      res.status(200).send({ msg: "Postulacion eliminada correctamente" });
      res.end();
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Error en el servidor" });
    res.end();
  }
};
