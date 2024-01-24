import express from "express";
import multer from "multer";
import { uploadFile } from "../controllers/uploadFileController";

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("image"), uploadFile);

export default router;
