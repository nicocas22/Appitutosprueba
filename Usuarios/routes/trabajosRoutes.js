const express = require("express");
const router = express.Router();
const trabajosControllers = require("../controllers/trabajosControllers");
const upload = require("../libs/storagePituto");

router.post("/", upload.array("galeriaURL"), trabajosControllers.crearTrabajo);

router.put("/:id", trabajosControllers.puttrabajo);

router.put("/filter/:skip", trabajosControllers.mostrarTrabajo);

router.put("/creados/:id/:skip", trabajosControllers.obtenerCreados);

router.put("/guardados/:skip", trabajosControllers.obtenerGuardados);

router.delete("/:id", trabajosControllers.deleteTrabajo);

router.get("/:id", trabajosControllers.mostrartrabajoId);

router.get("/total/trabajos", trabajosControllers.totaltrabajos);

module.exports = router;
