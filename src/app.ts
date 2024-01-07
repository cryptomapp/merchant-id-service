import express from "express";
import bodyParser from "body-parser";
import fundNodeRouter from "./routes/fundNode";
import uploadFileRouter from "./routes/uploadFile";

const app = express();

app.use(bodyParser.json());

app.use("/fundNode", fundNodeRouter);
app.use("/upload", uploadFileRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
