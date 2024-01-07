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
exports.getIrys = void 0;
const sdk_1 = __importDefault(require("@irys/sdk"));
const config_1 = require("../config");
const getIrys = () => __awaiter(void 0, void 0, void 0, function* () {
    const irys = new sdk_1.default({
        url: config_1.config.irysUrl,
        token: "solana",
        key: config_1.config.solPrivateKey,
        config: { providerUrl: config_1.config.solanaProviderUrl },
    });
    return irys;
});
exports.getIrys = getIrys;
