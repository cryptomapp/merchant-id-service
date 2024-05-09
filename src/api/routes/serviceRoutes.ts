import express from "express";
import { fundNode } from "../controllers/fundNodeController";
import { deployBubblegumTree } from "../controllers/deployBubblegumTreeController";

const serviceRouter = express.Router();

serviceRouter.post("/fund-node", fundNode);
serviceRouter.post("/deploy-bubblegum-tree", deployBubblegumTree);

export default serviceRouter;
