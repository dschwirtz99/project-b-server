import { getDatabase } from './database';
import fs from 'fs';
import path from 'path';

const db = getDatabase();

const seedsDir = path.resolve(__dirname, '../../seeds');
const files = fs.readdirSync(seedsDir).sort();

for (const file of files) {
  if (file.endsWith('.sql')) {
    console.log(`Running seed: ${file}`);
    const sql = fs.readFileSync(path.join(seedsDir, file), 'utf-8');
    db.exec(sql);
  }
}

console.log('All seeds complete.');
process.exit(0);
