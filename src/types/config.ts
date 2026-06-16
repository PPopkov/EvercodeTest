export interface AppConfig {
  port: number;
  authToken: string;
  binanceApiUrl: string;
  binanceRetries: number;
  binanceTimeout: number;
  blockchairApiUrl: string;
  blockchairRetries: number;
  blockchairTimeout: number;
  env: string;
  priceUpdateInterval: number;
  appName: string;
  version: string;
}
