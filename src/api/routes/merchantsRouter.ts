import express from "express";
import multer from "multer";
import { beginRegistrationProcess } from "../controllers/becomeMerchantController";
import {
  discoverMerchants,
  getAllMerchants,
  getMerchantDetails,
} from "../controllers/merchantDetailsController";

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

router.get("/", getMerchantDetails);
router.get("/all", getAllMerchants);
router.get("/discover", discoverMerchants);

// Become a Merchant Flow
router.post("/become", upload.single("image"), beginRegistrationProcess);

// Get Merchants
router.get("/");

export default router;
