import express from "express";
import fundNodeRouter from "./api/routes/fundNodeRoutes";
import uploadFileRouter from "./api/routes/uploadFileRoutes";
import deployBubblegumTreeRouter from "./api/routes/deployBubblegumTreeRoutes";
import { connectToMongoDB } from "./config/mongoConnections";
import { errorMiddleware } from "./api/middleware/errorMiddleware";
import { config } from "./config";
import cors from "cors";

const app = express();

connectToMongoDB();

app.use(express.json());

app.use(
  cors({
    origin: config.frontendUrl,
  })
);

app.use("/upload", uploadFileRouter);

// TODO: Admin only
app.use("/fund-node", fundNodeRouter);
app.use("/deploy-bubblegum-tree", deployBubblegumTreeRouter);

// Register the error handling middleware
app.use(errorMiddleware);

if (process.env.NODE_ENV !== "test") {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

export default app;
