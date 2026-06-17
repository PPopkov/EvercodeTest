import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const dir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

export const db = new Database('./data/app.db');