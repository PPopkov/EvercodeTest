const config = require('./config')
const { log } = require("./src/logger");
const app  = require("./src/app");;


app.listen(config.port, () => {
  log.info(`Server search on port: ${config.port} `);
});
