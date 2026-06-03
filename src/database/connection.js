const sqlite = require('node:sqlite');
const db = new sqlite.DatabaseSync('./data/app.db');
module.exports = db;