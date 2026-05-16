const config = require("../config");
const { getTimestamp } = require("./utils/getTimestamp");

function createLogger(appName) {
  return {
    info: (message) => {
      console.log(`[INFO] [${appName}] ${message} ${getTimestamp()}`);
    },
    error: (message) => {
      console.log(`[ERROR] [${appName}] ${message} ${getTimestamp()}`);
    },
    warn: (message) => {
      console.log(`[WARN] [${appName}] ${message} ${getTimestamp()}`);
    },
    debug: (message) => {
      console.log(`[DEBUG] [${appName}] ${message} ${getTimestamp()}`);
    },
    trace:(message) => {
      console.log(`[TRACE] [${appName}] ${message} ${getTimestamp()}`);
    },
  };
}

const log = createLogger(config.appName);

module.exports = { log };
