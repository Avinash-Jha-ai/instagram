import multer from "multer";

const storage = multer.diskStorage({
  destination: "uploads/", // make sure folder exists
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for video
});

export default upload;