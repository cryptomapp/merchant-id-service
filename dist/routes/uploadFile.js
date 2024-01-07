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
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filePath } = req.body; // Path to the file to upload
    try {
        const irys = yield (0, irysService_1.getIrys)();
        const fileData = fs_1.default.readFileSync(filePath, "utf8"); // Read the file data
        const receipt = yield irys.upload(fileData); // Upload the file data
        res
            .status(200)
            .json({ message: "File uploaded successfully", receiptId: receipt.id });
    }
    catch (error) {
        console.error("Error uploading file: ", error);
        res.status(500).json({ error: "Error uploading file" });
    }
}));
exports.default = router;
