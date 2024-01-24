import { Request, Response } from "express";
import { deployBubblegumTreeService } from "../../services/deployBubblegumTreeService";

export const deployBubblegumTree = async (req: Request, res: Response) => {
  try {
    const { maxDepth, maxBufferSize } = req.body;
    const merkleTreeAddress = await deployBubblegumTreeService(
      maxDepth,
      maxBufferSize
    );

    res.status(200).json({
      message: "Bubblegum Tree successfully deployed",
      merkleTreeAddress: merkleTreeAddress,
    });
  } catch (error) {
    console.error("Error deploying Bubblegum Tree:", error);
    res.status(500).json({ error: "Failed to deploy Bubblegum Tree" });
  }
};
