const config = require('./config');

function createLogger(appName) {
  return function log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${appName}] ${message}`);
  };
}

const log = createLogger(config.appName);

module.exports = { log };
