import { query, closeDatabase } from './database';
import fs from 'fs';
import path from 'path';

async function runSeeds() {
  const seedsDir = path.resolve(__dirname, '../../seeds');
  const files = fs.readdirSync(seedsDir).sort();

  for (const file of files) {
    if (file.endsWith('.sql')) {
      console.log(`Running seed: ${file}`);
      const sql = fs.readFileSync(path.join(seedsDir, file), 'utf-8');
      await query(sql);
    }
  }

  console.log('All seeds complete.');
  await closeDatabase();
  process.exit(0);
}

runSeeds().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
