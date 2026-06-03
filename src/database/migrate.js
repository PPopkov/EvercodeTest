const database = require("./connection");

function migrate() {
  database.exec(`
    CREATE TABLE IF NOT EXISTS currencies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      ticker TEXT NOT NULL UNIQUE
    ) 
  `);

  database.exec(`
    CREATE TABLE IF NOT EXISTS prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT NOT NULL UNIQUE,
      price REAL NOT NULL,
      updated_at TEXT NOT NULL
    ) 
  `);
} 

module.exports = migrate ;



