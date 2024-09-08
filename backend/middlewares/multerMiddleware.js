import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define storage strategy
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "others";
    if (file.fieldname === "attachments") {
      if (file.mimetype.startsWith("image/")) {
        folder = "images";
      } else if (file.mimetype.startsWith("video/")) {
        folder = "videos";
      }
    } else {
      folder = file.fieldname;
    }
    cb(null, path.join(__dirname, "../public/uploads", folder));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// File filter to allow only certain file types, images and videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed!"));
  }
};

// Initialize multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 200 },
  fileFilter: fileFilter,
});

export default upload;
