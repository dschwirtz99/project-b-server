"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db = (0, database_1.getDatabase)();
const migrationsDir = path_1.default.resolve(__dirname, '../../migrations');
const files = fs_1.default.readdirSync(migrationsDir).sort();
for (const file of files) {
    if (file.endsWith('.sql')) {
        console.log(`Running migration: ${file}`);
        const sql = fs_1.default.readFileSync(path_1.default.join(migrationsDir, file), 'utf-8');
        db.exec(sql);
    }
}
console.log('All migrations complete.');
process.exit(0);
//# sourceMappingURL=migrate.js.map