require('dotenv').config();
// const { scheduleTask } = require("./src/scheduler");
const { log } = require("./src/logger");
const app  = require("./src/app");
const port = 3000;

// scheduleTask("Timer", 1000, () => {
//   log.info("running");
// });

// try {
//   scheduleTask(123, 1000, log.info);
// } catch (error) {
//   log.error(`${error.name}: ${error.message}`);
// }

app.listen(port, () => {
  log.info(`Server search on port: ${port} `);
});
