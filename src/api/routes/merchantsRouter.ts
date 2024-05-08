import express from "express";
import multer from "multer";
import { beginRegistrationProcess } from "../controllers/becomeMerchantController";

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

// Become a Merchant Flow
router.post("/become", upload.single("image"), beginRegistrationProcess);

// Discover Merchants by name, category, keyword + location
router.get("/discover");

// Get Merchants
router.get("/");

export default router;
