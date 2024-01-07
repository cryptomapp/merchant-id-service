import express from "express";
import { getIrys } from "../irys/irysService";

const router = express.Router();

router.post("/", async (req, res) => {
  const { amount } = req.body; // Amount to fund

  try {
    const irys = await getIrys();
    const fundTx = await irys.fund(irys.utils.toAtomic(amount)); // Convert amount to atomic units and fund
    res.status(200).json({
      message: `Successfully funded ${amount} tokens`,
      transactionId: fundTx.id,
    });
  } catch (error) {
    console.error("Error funding node: ", error);
    res.status(500).json({ error: "Error funding node" });
  }
});

export default router;
