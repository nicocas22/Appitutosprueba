const Trabajos = require("../models/trabajos");
const Postulacion = require("../models/postulacion");

exports.crearTrabajo = async (req, res) => {
  const { tags, beneficios, direccion, fechaTermino } = req.body;

  try {
    let parseTags = JSON.parse(tags);
    let parseBeneficios = JSON.parse(beneficios);
    let parseDireccion = JSON.parse(direccion);
    let parseFechaTermino = JSON.parse(fechaTermino);
    const fTermino = new Date(parseFechaTermino);
    let galeriaURL = [];

    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        const url = `https://appitutosprueba.azurewebsites.net/public/images/${req.files[i].filename}`;
        galeriaURL.push(url);
      }
    }
    req.body.galeriaURL = galeriaURL;
    req.body.tags = parseTags;
    req.body.beneficios = parseBeneficios;
    req.body.direccion = parseDireccion;
    req.body.fechaTermino = fTermino;

    const trabajo = new Trabajos(req.body);
    await trabajo.save();
    res.status(200).json(trabajo);
  } catch (error) {
    res.status(500).json({ msg: "Hubo un error" });
  }
};

exports.mostrarTrabajo = async (req, res) => {
  const skip = req.params.skip;
  const query = req.body;
  // console.log(query);
  // console.log(skip);
  try {
    const querie = await createQuery(query);

    const trabajos = await Trabajos.find(querie, undefined, {
      skip: parseInt(skip),
      limit: 8,
    }).sort({ creacion: -1 });

    res.json(trabajos);
    // const datatrabajos = await datapostulaciones(trabajos);
    // res.json(datatrabajos);
  } catch (err) {
    res.status(500).json({ msg: "Hubo un error" });
  }
};

exports.deleteTrabajo = async (req, res) => {
  const id = req.params.id;

  try {
    const trabajo = await Trabajos.findById(id);
    console.log(trabajo);
    await trabajo.remove();

    res.status(200).json({ msg: "trabajo Eliminado Correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};

exports.mostrartrabajoId = async (req, res) => {
  const id = req.params.id;

  try {
    const trabajo = await Trabajos.findById(id);

    res.json(trabajo);
  } catch (err) {
    res.status(500).json({ msg: "Hubo un error" });
  }
};

exports.totaltrabajos = async (req, res) => {
  try {
    const trabajos = await Trabajos.find().countDocuments();

    res.json({ total: trabajos });
  } catch (err) {
    res.status(500).json({ msg: "Hubo un error" });
  }
};

exports.puttrabajo = async (req, res) => {
  const id = req.params.id;

  const {
    titulo,
    descripcion,
    salario,
    direccion,
    telefono,
    metodoPago,
    fechaTermino,
    visible,
    beneficios,
    categoria,
    tags,
    promocion,
    idContratado2,
  } = req.body;

  try {
    const trabajo = await Trabajos.findById(id);
    if (!trabajo) return;

    if (titulo) trabajo.titulo = titulo;
    if (categoria) trabajo.categoria = categoria;
    if (descripcion) trabajo.descripcion = descripcion;
    if (salario) trabajo.salario = salario;
    if (direccion) trabajo.direccion = direccion;
    if (telefono) trabajo.telefono = telefono;
    if (metodoPago) trabajo.metodoPago = metodoPago;
    if (fechaTermino) trabajo.fechaTermino = fechaTermino;
    if (visible) trabajo.visible = visible;
    if (beneficios) trabajo.beneficios = beneficios;
    if (tags) trabajo.tags = tags;
    if (promocion) trabajo.promocion = promocion;
    if (idContratado2 === "ELIMINAR_CONTRATADO") {
      trabajo.idContratado = null;
    } else if (idContratado2) {
      trabajo.idContratado = idContratado2;
    }

    trabajo.save();
    const respuesta = await datapostulaciones([trabajo]);
    console.log(respuesta);
    res.status(200).json(respuesta);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};

/**create query */
const createQuery = (data) => {
  const { _id, search, precio, categoria } = data;
  let query = {};
  if (search) {
    query.$or = [];
  }
  // { idusuario: { $ne: "606f6c156754533f841b4cec" } },
  if (_id) query.idusuario = { $ne: _id };
  if (precio > 0) {
    query.salario = { $gte: 0, $lte: precio };
  }
  if (categoria) {
    query.categoria = categoria;
  }

  if (search) {
    query.$or.push({ titulo: { $regex: `${search}`, $options: "i" } });
  }

  return query;
};

exports.obtenerCreados = async (req, res) => {
  const skip = req.params.skip;
  const id = req.params.id;
  const query = req.body;
  // console.log(query);
  try {
    const trabajos = await Trabajos.find({ idusuario: id }, undefined, {
      skip: parseInt(skip),
      limit: 6,
    }).sort({ creacion: -1 });
    // console.log(trabajos);
    // res.json(trabajos);
    const datatrabajos = await datapostulaciones(trabajos);
    res.json(datatrabajos);
  } catch (err) {
    res.status(500).json({ msg: "Hubo un error" });
  }
};

const datapostulaciones = async (trabajos) => {
  for (let i = 0; i < trabajos.length; i++) {
    const postulaciones = await Postulacion.find({
      idtrabajo: trabajos[i]._id,
    });
    trabajos[i].postulaciones = postulaciones;
  }

  return trabajos;
};

exports.obtenerGuardados = async (req, res) => {
  const skip = req.params.skip;
  const ids = req.body;
  // console.log(query);
  try {
    const guardados = [];
    for (let i = 0; i < ids.length; i++) {
      const trabajo = await Trabajos.findById(ids[i], undefined, {
        skip: parseInt(skip),
        limit: 6,
      }).sort({ creacion: -1 });
      // console.log(trabajo);
      if (trabajo) {
        guardados.push(trabajo);
      }
    }
    // console.log(guardados);
    res.json(guardados);
  } catch (err) {
    res.status(500).json({ msg: "Hubo un error" });
  }
};
