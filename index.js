const express = require("express");
const cors = require("cors");
const conectarDB = require("./Config/db");
//Creacion de servidor
const server = express();
//conectar db
conectarDB();
server.use(cors());

//puerto de la app
const port = process.env.PORT || 4000;

//Habiltiar express.json
server.use(express.json({ extended: true }));

//ruta usuario router
server.use("/api/usuarios", require("./Usuarios/routes/usuarioRoutes"));
//ruta postulacion router
server.use("/api/postulacion", require("./Usuarios/routes/postulacionRoutes"));
//autenticacion
server.use("/api/auth", require("./Usuarios/routes/Auth"));
//ruta trabajos
server.use("/api/pitutos", require("./Usuarios/routes/trabajosRoutes"));
//ruta para foto perfil
server.use("/public", express.static(`${__dirname}/storage/fotosPerfil`));
//ruta para fotos de pitutos
server.use(
  "/public/images",
  express.static(`${__dirname}/storage/fotosPitutos`)
);
//arrancar app
const ioServer = require("./socket")(server);
ioServer.listen(port, "0.0.0.0", () => {
  console.log(`El servidor esta funcionando en el puerto ${port}`);
});
