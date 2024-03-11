import express from "express";
import { getMerchantDetails } from "../controllers/merchantDetailsController";

const router = express.Router();

router.get("/", getMerchantDetails);

export default router;
