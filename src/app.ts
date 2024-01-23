import express from "express";
import bodyParser from "body-parser";
import fundNodeRouter from "./routes/fundNode";
import uploadFileRouter from "./routes/uploadFile";
import deployBubblegumTreeRouter from "./routes/deployBubblegumTree";

const app = express();

app.use(bodyParser.json());

// TODO: We need to add CORS headers here
app.use("/upload", uploadFileRouter);

// TODO: These should be admin only routes
app.use("/fundNode", fundNodeRouter);
app.use("/deployBubblegumTree", deployBubblegumTreeRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
