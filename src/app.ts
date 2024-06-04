import express from "express";
import { connectToMongoDB } from "./config/mongoConnections";
import { errorMiddleware } from "./api/middleware/errorMiddleware";
import { config } from "./config";
import cors from "cors";
import merchantsRouter from "./api/routes/merchantsRouter";
import serviceRouter from "./api/routes/serviceRoutes";
import statsRouter from "./api/routes/statsRouter";

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
app.use("/service", serviceRouter);
app.use("/stats", statsRouter);

app.use(errorMiddleware);

if (process.env.NODE_ENV !== "test") {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

export default app;
