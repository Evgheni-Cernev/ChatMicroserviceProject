import multer from "multer";
import fs from "fs";

const uploadDir = "userAvatar";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Uploading file:", file);
    cb(null, uploadDir + "/");
  },
  filename: function (req, file, cb) {
    console.log("Uploading file:", file);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

export const upload = multer({
  storage: storage,
}).single("file");
