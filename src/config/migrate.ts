import { getDatabase } from './database';
import fs from 'fs';
import path from 'path';

const db = getDatabase();

const migrationsDir = path.resolve(__dirname, '../../migrations');
const files = fs.readdirSync(migrationsDir).sort();

for (const file of files) {
  if (file.endsWith('.sql')) {
    console.log(`Running migration: ${file}`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    db.exec(sql);
  }
}

console.log('All migrations complete.');
process.exit(0);
