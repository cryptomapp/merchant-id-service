import express from "express";
import { getIrys } from "../irys/irysService";
import fs from "fs";

const router = express.Router();

router.post("/", async (req, res) => {
  const { filePath } = req.body; // Path to the file to upload

  try {
    const irys = await getIrys();
    const fileData = fs.readFileSync(filePath, "utf8"); // Read the file data

    const receipt = await irys.upload(fileData); // Upload the file data
    res
      .status(200)
      .json({ message: "File uploaded successfully", receiptId: receipt.id });
  } catch (error) {
    console.error("Error uploading file: ", error);
    res.status(500).json({ error: "Error uploading file" });
  }
});

export default router;
