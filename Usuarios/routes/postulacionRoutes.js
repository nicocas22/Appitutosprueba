const express = require("express");
const router = express.Router();
const postulacionControllers = require('../controllers/postulacionControllers');

router.post("/", postulacionControllers.crearPostulacion);

router.put("/:id", postulacionControllers.obtenerPostulaciones);



router.delete("/:idpostulacion", postulacionControllers.deletePostulacion);


router.get("/total/pitutos/:id", postulacionControllers.obtenertrabajosCount);





module.exports = router;