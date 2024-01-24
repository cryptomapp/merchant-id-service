import { Request, Response } from "express";
import { fundNodeService } from "../../services/fundNodeService";

export const fundNode = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    const transactionId = await fundNodeService(amount);
    res.status(200).json({
      message: `Successfully funded ${amount} tokens`,
      transactionId: transactionId,
    });
  } catch (error) {
    console.error("Error funding node: ", error);
    res.status(500).json({ error: "Error funding node" });
  }
};
