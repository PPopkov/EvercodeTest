const { log } = require('./logger');

log('scheduler.js started');

function scheduleTask(name, interval, task) {
  log(`Task "${name}" scheduled every ${interval}ms`);
  setInterval(() => {
    task();
  }, interval);
}

scheduleTask('Timer', 1000, () => {
  log('running');
});
