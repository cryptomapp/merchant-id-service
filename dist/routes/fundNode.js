"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const irysService_1 = require("../irys/irysService");
const router = express_1.default.Router();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body; // Amount to fund
    try {
        const irys = yield (0, irysService_1.getIrys)();
        const fundTx = yield irys.fund(irys.utils.toAtomic(amount)); // Convert amount to atomic units and fund
        res.status(200).json({
            message: `Successfully funded ${amount} tokens`,
            transactionId: fundTx.id,
        });
    }
    catch (error) {
        console.error("Error funding node: ", error);
        res.status(500).json({ error: "Error funding node" });
    }
}));
exports.default = router;
