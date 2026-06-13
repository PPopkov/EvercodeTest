import { config } from "../../config";
import { getTimestamp } from "./getTimestamp";
import { randomUUID } from "crypto";
import { Logger } from "../types/logger";

export function createLogger (appName: string): Logger {
  return {
    info: (message, id = randomUUID()) => {
      console.log(`[INFO] [${appName}] [${id}] ${message} ${getTimestamp()}`);
    },
    error: (message, id = randomUUID()) => {
      console.log(`[ERROR] [${appName}] [${id}] ${message} ${getTimestamp()}`);
    },
    warn: (message, id = randomUUID()) => {
      console.log(`[WARN] [${appName}] [${id}] ${message} ${getTimestamp()}`);
    },
    debug: (message, id = randomUUID()) => {
      console.log(`[DEBUG] [${appName}] [${id}] ${message} ${getTimestamp()}`);
    },
    trace: (message, id = randomUUID()) => {
      console.log(`[TRACE] [${appName}] [${id}] ${message} ${getTimestamp()}`);
    },
  };
}

export  const log = createLogger(config.appName);