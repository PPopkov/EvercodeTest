import dotenv from "dotenv";
import { AppConfig } from "./src/types";
dotenv.config();

export const config: AppConfig = {
  port: Number(process.env.PORT) || 3000,
  authToken: process.env.AUTH_TOKEN || "",
  binanceApiUrl:
    process.env.BINANCE_API_URL ||
    "https://api.binance.com/api/v3/ticker/price",
  binanceRetries: Number(process.env.BINANCE_RETRIES) || 3,
  binanceTimeout: Number(process.env.BINANCE_TIMEOUT) || 5000,
  blockchairApiUrl:
    process.env.BLOCKCHAIR_API_URL || "https://api.blockchair.com",
  blockchairRetries: Number(process.env.BLOCKCHAIR_RETRIES) || 3,
  blockchairTimeout: Number(process.env.BLOCKCHAIR_TIMEOUT) || 5000,
  env: process.env.NODE_ENV || "development",
  priceUpdateInterval: Number(process.env.PRICE_UPDATE_INTERVAL) || 40000,
  appName: "CareerApp",
  version: "1.0.0",
};
