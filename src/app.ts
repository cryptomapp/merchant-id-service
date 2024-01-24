import express from "express";
import fundNodeRouter from "./api/routes/fundNodeRoutes";
import uploadFileRouter from "./api/routes/uploadFileRoutes";
import deployBubblegumTreeRouter from "./api/routes/deployBubblegumTreeRoutes";
import { connectToMongoDB } from "./config/mongoConnections";
import { errorMiddleware } from "./api/middleware/errorMiddleware";

const app = express();

connectToMongoDB();

app.use(express.json());

// TODO: Add Cors
app.use("/upload", uploadFileRouter);

// TODO: Admin only
app.use("/fundNode", fundNodeRouter);
app.use("/deployBubblegumTree", deployBubblegumTreeRouter);

// Register the error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
