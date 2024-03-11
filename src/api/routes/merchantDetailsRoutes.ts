import express from "express";
import {
  getAllMerchants,
  getMerchantDetails,
} from "../controllers/merchantDetailsController";

const router = express.Router();

router.get("/", getMerchantDetails);
router.get("/all", getAllMerchants);

export default router;
