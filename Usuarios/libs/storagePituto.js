const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./storage/fotosPitutos");
  },
  filename: function (req, file, cb) {
    let extension = file.originalname.split(".").reverse()[0];
    cb(null, `${file.fieldname}-${Date.now()}.${extension}`);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
