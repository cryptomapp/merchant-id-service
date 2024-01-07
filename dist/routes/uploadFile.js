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
// src/routes/uploadFile.ts
const express_1 = __importDefault(require("express"));
const irysService_1 = require("../irys/irysService");
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const validation_1 = require("../utils/validation");
const router = express_1.default.Router();
// Configure multer for image upload
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        // Use Date.now() to name the file uniquely
        cb(null, `${Date.now()}${path_1.default.extname(file.originalname)}`);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
router.post("/", upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract MerchantData and image file from the request
        const merchantData = JSON.parse(req.body.data);
        const imageFile = req.file;
        if (!(0, validation_1.isValidMerchantData)(merchantData)) {
            throw new Error("Invalid merchant data provided.");
        }
        if (!imageFile) {
            throw new Error("No image provided.");
        }
        const irys = yield (0, irysService_1.getIrys)();
        // Upload image to Irys and receive a URL
        const imageData = fs_1.default.readFileSync(imageFile.path);
        const imageReceipt = yield irys.upload(imageData);
        const imageUrl = `https://gateway.irys.xyz/${imageReceipt.id}`;
        // Combine image URL with merchant data for full metadata
        const metadata = Object.assign(Object.assign({}, merchantData), { imageUrl });
        const metadataReceipt = yield irys.upload(JSON.stringify(metadata));
        // Delete the image from the server after upload
        fs_1.default.unlinkSync(imageFile.path);
        res.status(200).json({
            message: "File and metadata uploaded successfully",
            imageDataId: imageReceipt.id,
            metadataId: metadataReceipt.id,
        });
    }
    catch (error) {
        console.error("Error during file upload: ", error);
        // Clean up any residual files in case of an error
        if (req.file) {
            fs_1.default.unlinkSync(req.file.path);
        }
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "Error uploading file or metadata" });
        }
    }
}));
exports.default = router;
