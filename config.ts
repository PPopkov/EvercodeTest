import dotenv from 'dotenv';
import { AppConfig } from './src/types'; 
dotenv.config()

export const config: AppConfig  = {
  port: Number(process.env.PORT) || 3000,
  authToken: process.env.AUTH_TOKEN || '',
  binanceApiUrl:
    process.env.BINANCE_API_URL ||
    "https://api.binance.com/api/v3/ticker/price",

  env: process.env.NODE_ENV || "development",
  priceUpdateInterval: Number(process.env.PRICE_UPDATE_INTERVAL) || 40000,
  appName: "CareerApp",
  version: "1.0.0",
};
