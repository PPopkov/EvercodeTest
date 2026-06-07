require("dotenv").config();

const config = {
  port: process.env.PORT || 3000,
  authToken: process.env.AUTH_TOKEN,
  binanceApiUrl:
    process.env.BINANCE_API_URL ||
    "https://api.binance.com/api/v3/ticker/price",

  env: process.env.NODE_ENV || "development",
  priceUpdateInterval: process.env.PRICE_UPDATE_INTERVAL || 40000,
  appName: "CareerApp",
  version: "1.0.0",
};

module.exports = config;
