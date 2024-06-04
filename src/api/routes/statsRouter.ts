import express from "express";
import { getMerchants, getUsers } from "../controllers/statsController";

const statsRouter = express.Router();

statsRouter.get("/users", getUsers);
statsRouter.get("/merchants", getMerchants);

export default statsRouter;
