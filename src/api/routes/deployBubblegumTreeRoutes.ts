import express from "express";
import { deployBubblegumTree } from "../controllers/deployBubblegumTreeController";

const router = express.Router();

router.post("/", deployBubblegumTree);

export default router;
