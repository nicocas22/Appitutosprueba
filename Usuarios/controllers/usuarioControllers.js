const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const fs = require("fs").promises;
const jwt = require("jsonwebtoken");
const Postulacion = require("../models/postulacion");

exports.crearUsuario = async (req, res) => {
  //extraer email y pass
  const { email, password } = req.body;
  try {
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res
        .status(400)
        .json({ msg: "El email ya se encuentra registrado" });
    }
    //crear nuevo usuario
    usuario = new Usuario(req.body);

    //Hasheo de Pass
    const salt = await bcryptjs.genSalt(15);
    usuario.password = await bcryptjs.hash(password, salt);

    //guardar new user
    await usuario.save();

    //creacion y firma JWT
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };

    //firma JWT
    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 3600000,
      },
      (error, token) => {
        if (error) throw error;
        //mensaje de confirmacion
        res.json({ token });
      }
    );

    // Creacion envio email luego se creara
    //Crear URL de confirmacion
    // const confirmarUrl = `http://${req.headers.host}/api/confirmar/${email}`;
    // // const confirmarUrl = `http://zaptalent.cl/login-register/${email}`;

    // //crear objeto usuario
    // const userconfi = {
    //   email,
    // };
    // //Enviar email
    // await enviarEmail.enviar({
    //   userconfi,
    //   subject: "Confirma tu cuenta de ZapTalent",
    //   confirmarUrl,
    //   archivo: "emailconfirm",
    // });
  } catch (error) {
    console.log(error);
    res.status(400).send("hubo un error");
  }
};

exports.mostrarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findById(req.params.id).select("-password");

    if (!usuarios) {
      res.status(404).json({ msg: "Usuario no existe" });
    }

    res.json(usuarios);
  } catch (error) {
    console.log(error);
  }
};

exports.putUsuario = async (req, res) => {
  const {
    nombres,
    fechaNacimiento,
    direccion,
    email,
    rut,
    telefono,
    trabajos,
    favoritos,
    intereses,
  } = req.body;
  try {
    const iduser = req.params.iduser;

    const usuario = await Usuario.findById(iduser);

    if (nombres) usuario.nombres = nombres;
    if (fechaNacimiento) usuario.fechaNacimiento = fechaNacimiento;
    if (direccion) {
      let parseDireccion = JSON.parse(direccion);
      usuario.direccion = parseDireccion;
    }
    if (email) usuario.email = email;
    if (rut) usuario.rut = rut;
    if (telefono) usuario.telefono = telefono;
    if (trabajos) usuario.trabajos = trabajos;
    if (intereses) {
      let parseIntereses = JSON.parse(intereses);
      usuario.intereses = parseIntereses;
    }
    if (favoritos) {
      let parseFavoritos = JSON.parse(favoritos);
      usuario.favoritos = parseFavoritos;
    }
    if (req.file) {
      console.log("hay un archivo");
      const { filename } = req.file;
      usuario.setperfilURL(filename);
    }

    await usuario.save();
    res.json(usuario);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en Servidor" });
  }
};

exports.actualizarPassword = async (req, res) => {
  const { passwordActual, password } = req.body;
  const iduser = req.params.iduser;
  try {
    const usuario = await Usuario.findById(iduser);
    const resultado = await bcryptjs.compare(passwordActual, usuario.password);
    if (resultado) {
      usuario.password = bcryptjs.hashSync(password, bcryptjs.genSaltSync(15));
      usuario.save(function (err) {
        if (err) {
          return res.status(500).json({ msg: "Error en el servidor" });
        }
        res.status(200).json({ msg: "Contraseña actualizada correctamente" });
      });
    } else {
      return res.status(404).json({ msg: "Contraseña incorrecta" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};

exports.obtenerTotalPostulacionCount = async (req, res) => {
  const idusuario = req.params.id;
  try {
    const total = await Postulacion.find({
      idusuario: idusuario,
      eliminado: false,
    }).countDocuments();

    return res.status(200).json(total);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};

exports.deleteUsuario = async (req, res) => {
  const id = req.params.id;

  try {
    const usuario = await Usuario.findById(id);

    await usuario.remove();

    res.status(200).json({ msg: "usuario Eliminado Correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};

//VALIDAR EMAIL/RUT UNICOS
exports.validacionEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const emailValidado = await Usuario.findOne({ email: email });

    let _email = Boolean(emailValidado);

    return res.status(200).json({ _email });
  } catch (error) {
    res.status(400).json({ msg: "Error en el servidor" });
  }
};

exports.confirmarCuenta = async (req, res) => {
  const email = req.params.correo;

  let usuario = await Usuario.findOne({ email });

  if (!usuario) {
    res.status(404).send("No valido");
    // res.redirect("https://www.zaptalent.cl/login");
    return;
  }
  //crear objeto usuario
  // const userconfi = {
  //   email,
  // };
  // const name = usuario.nombres;
  // const emails = usuario.email;
  // const phone = usuario.telefono;

  usuario.activo = 1;

  await usuario.save();
  //Enviar email
  // await enviarEmail.enviar({
  //   userconfi,
  //   subject:
  //     "Felicidades! hemos activado tu cuenta correctamente. Tus datos son: ",
  //   name,
  //   apellidos,
  //   rut,
  //   emails,
  //   phone,
  //   ecivil,
  //   nacion,
  //   direccion,
  //   archivo: "infouser",
  // });

  //si el usuario no existe
  // Opens the URL in the default browser.
  // res.writeHead(301, { Location: "https://www.zaptalent.cl/login" });
  res.end();
};

exports.actualizarFotoPerfil = async (req, res) => {
  const iduser = req.params.iduser;

  try {
    const usuario = await Usuario.findById(iduser);

    if (usuario.imageURL === undefined) {
      //subida de imagen
      if (req.file) {
        const { filename } = req.file;
        usuario.setImgUrl(filename);
      } else {
        return res.status(500).json({ msg: "No hay archivo" });
      }
    } else {
      let url = usuario.imageURL;
      let largoUrl = usuario.imageURL.length;
      let nameImage = url.substr(28, largoUrl);
      let urlServer =
        // aqui va el url donde guarda la fotografia para borrar desde la ruta "C:/Users/Abraham/Desktop/SapReact/Server/storage/usuario";
        fs
          .unlink(urlServer.concat(nameImage))
          .then(() => {
            console.log("Archivo eliminado");
          })
          .catch((err) => {
            console.log(err);
            console.error("Hubo un error al eliminar el archivo. ", err);
          });

      if (req.file) {
        const { filename } = req.file;
        usuario.setImgUrl(filename);
      } else {
        return res.status(500).json({ msg: "No hay archivo" });
      }
    }
    usuario.save(function (err) {
      if (err) {
        return res.status(500).json({ msg: "Error en el servidor" });
      }
      res.status(200).json({ msg: "Se ha actualizado tu foto de perfil." });
    });
  } catch (error) {
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};
