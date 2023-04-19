const multer = require("multer");
const path = require("path");

const tempDir = path.join(__dirname, "..", "tmp");

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (res, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadDate = multer({ storage: multerConfig });

module.exports = uploadDate;
