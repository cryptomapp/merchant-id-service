import { Request, Response } from "express";
import { Merchant } from "../../models/merchant";
import mongoose from "mongoose";

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

export const discoverMerchants = async (req: Request, res: Response) => {
  const { longitude, latitude, radius, lang, searchText } = req.query;

  // Convert radius from kilometers to meters
  const maxDistance = parseInt(radius as string, 10) * 1000;
  const coords = [
    parseFloat(longitude as string),
    parseFloat(latitude as string),
  ];

  if (isNaN(coords[0]) || isNaN(coords[1]) || isNaN(maxDistance)) {
    return res
      .status(400)
      .json({ message: "Invalid location or radius parameters" });
  }

  try {
    let query: { [key: string]: any } = {
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: coords,
          },
          $maxDistance: maxDistance,
        },
      },
    };

    if (typeof searchText === "string" && searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      query.$where = new Function(
        'return this.name.toLowerCase().includes("' +
          searchLower +
          '") || ' +
          'this.description.toLowerCase().includes("' +
          searchLower +
          '") || ' +
          'this.categories.some(function(category) { return category.toLowerCase().includes("' +
          searchLower +
          '"); });'
      );
    }

    const collationSettings = {
      locale: typeof lang === "string" ? lang : "en",
      strength: 1,
    };

    const merchants = await mongoose
      .model("Merchant")
      .find(query)
      .collation(collationSettings);

    res.status(200).json(merchants);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Server error", error: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};
