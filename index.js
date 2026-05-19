const { scheduleTask } = require("./src/scheduler");
const { log } = require("./src/logger");

scheduleTask("Timer", 1000, () => {
  log.info("running");
});

try {
  scheduleTask(123, 1000, log.info);
} catch (error) {
  log.error(`${error.name}: ${error.message}`);
}