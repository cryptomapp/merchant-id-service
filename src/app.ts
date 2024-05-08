import express from "express";
import fundNodeRouter from "./api/routes/fundNodeRoutes";
import uploadFileRouter from "./api/routes/merchantsRouter";
import merchantDetailsRouter from "./api/routes/merchantDetailsRoutes";
import deployBubblegumTreeRouter from "./api/routes/deployBubblegumTreeRoutes";
import { connectToMongoDB } from "./config/mongoConnections";
import { errorMiddleware } from "./api/middleware/errorMiddleware";
import { config } from "./config";
import cors from "cors";
import merchantsRouter from "./api/routes/merchantsRouter";

const app = express();

connectToMongoDB();

app.use(express.json());

app.use(
  cors({
    origin: [config.frontendUrl, "http://localhost:9000"],
  })
);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use("/merchants", merchantsRouter);

// app.use("/upload", uploadFileRouter);
// app.use("/get-merchant-details", merchantDetailsRouter);

// // TODO: ServiceWallet only
// app.use("/fund-node", fundNodeRouter);
// app.use("/deploy-bubblegum-tree", deployBubblegumTreeRouter);

app.use(errorMiddleware);

if (process.env.NODE_ENV !== "test") {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

export default app;
