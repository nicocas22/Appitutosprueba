//Rutas para crear usuario
const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioControllers");
const upload = require("../libs/storage");

router.post("/", usuarioController.crearUsuario);
router.get("/:id", usuarioController.mostrarUsuarios);
router.put("/:iduser", upload.single("perfilURL"), usuarioController.putUsuario);

router.put(
  "/actualizar-password/:iduser",
  usuarioController.actualizarPassword
);
router.delete("/:id", usuarioController.deleteUsuario);
router.put(
  "/subir-foto-perfil/:iduser",
  upload.single("imageURL"),
  usuarioController.actualizarFotoPerfil
);
router.post("/validacion/email", usuarioController.validacionEmail);

module.exports = router;
