import mongoose from "mongoose";
import { config } from "./index";

export const connectToMongoDB = () => {
  mongoose
    .connect(config.mongoUri)
    .then(() => console.log("MongoDB successfully connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));
};
