import express from "express";
import { getIrys } from "../irys/irysService";

const router = express.Router();

router.post("/", async (req, res) => {
  // Implement the fund node logic here using getIrys()
  res.send("Fund node route");
});

export default router;
