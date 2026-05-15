const { scheduleTask } = require("./src/scheduler");
const { log } = require("./src/logger");

scheduleTask("Timer", 1000, () => {
  log("running");
});
