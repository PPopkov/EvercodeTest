const sqlite = require('node:sqlite');

const database = new sqlite.DatabaseSync('./data/app.db');

database.exec(`
    CREATE TABLE IF NOT EXISTS currencies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      ticker TEXT NOT NULL UNIQUE
    ) 
  `);

  module.exports = database;