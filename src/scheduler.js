const { SchedulerError } = require("./errors/SchedulerError");
const { ValidationError } = require("./errors/ValidationError");
const { log } = require("./logger");

log("scheduler.js started");

function scheduleTask(name, interval, task) {
  if (typeof name !== "string")
    throw new ValidationError("name должно быть строкой");
  if (typeof interval !== "number" || interval <= 0)
    throw new ValidationError("interval должен быть больше нуля");
  if (typeof task !== "function")
    throw new ValidationError("task должна быть функцией");

  log(`Task "${name}" scheduled every ${interval}ms`);

  setInterval(async () => {
    try {
      await task();
    } catch (error) {
      throw new SchedulerError("Задача упала: " + error.message);
    }
  }, interval);
}

module.exports = {scheduleTask}