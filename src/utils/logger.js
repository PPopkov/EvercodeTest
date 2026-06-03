const config = require("../../config");
const { getTimestamp } = require("./getTimestamp");
const { randomUUID } = require("crypto");

function createLogger(appName) {
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

const log = createLogger(config.appName);

module.exports = { log };
