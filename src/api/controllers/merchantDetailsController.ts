import { Request, Response } from "express";
import { Merchant } from "../../models/merchant";

export const getMerchantDetails = async (req: Request, res: Response) => {
  try {
    // Extract owner (Solana address) from query parameters
    const { owner } = req.query;

    if (!owner) {
      return res.status(400).json({ message: "Owner address is required" });
    }

    // Find the merchant by owner
    const merchant = await Merchant.findOne({ owner: owner.toString() });

    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    res.status(200).json(merchant);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Server error", error: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const getAllMerchants = async (req: Request, res: Response) => {
  try {
    // Fetch all merchants from the database
    const merchants = await Merchant.find({});

    // Send the list of merchants as a response
    res.status(200).json(merchants);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Server error", error: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};
