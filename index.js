const { scheduleTask } = require("./src/scheduler");
const { log } = require("./src/logger");
const app  = require("./src/app");

scheduleTask("Timer", 1000, () => {
  log.info("running");
});

try {
  scheduleTask(123, 1000, log.info);
} catch (error) {
  log.error(`${error.name}: ${error.message}`);
}

app.listen(3000, () => {
  log.info("Server search on port 3000");
});
