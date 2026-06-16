import { db } from "./connection";


export function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS currencies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      ticker TEXT NOT NULL UNIQUE,
      blockchain TEXT NOT NULL
    ) 
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT NOT NULL UNIQUE,
      price REAL NOT NULL,
      updated_at TEXT NOT NULL
    ) 
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS prices_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT NOT NULL,
      price REAL NOT NULL,
      recorded_at TEXT NOT NULL
    ) 
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      address TEXT NOT NULL UNIQUE,
      label TEXT,
      ticker TEXT NOT NULL
    ) 
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS blockchain_height (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT NOT NULL UNIQUE,
      height INTEGER NOT NULL,
      updated_at TEXT NOT NULL
    ) 
  `);
}
