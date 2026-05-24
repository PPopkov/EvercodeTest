require('dotenv').config();
const { log } = require("./src/logger");
const app  = require("./src/app");
const port = 3000;


app.listen(port, () => {
  log.info(`Server search on port: ${port} `);
});
