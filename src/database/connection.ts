import sqlite from 'node:sqlite';
export const db = new sqlite.DatabaseSync('./data/app.db');