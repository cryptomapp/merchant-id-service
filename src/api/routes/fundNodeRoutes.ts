import express from "express";
import { fundNode } from "../controllers/fundNodeController";

const router = express.Router();

router.post("/", fundNode);

export default router;
