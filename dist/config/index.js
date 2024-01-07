"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    irysUrl: "https://devnet.irys.xyz",
    solanaProviderUrl: "https://api.devnet.solana.com",
    solPrivateKey: process.env.MERCHANT_ID_ISSUER_DEV || "",
};
