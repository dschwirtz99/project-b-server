"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const players_1 = require("./routes/players");
const events_1 = require("./routes/events");
const news_1 = require("./routes/news");
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimiter_1 = require("./middleware/rateLimiter");
const cron_1 = require("./jobs/cron");
const logger_1 = require("./utils/logger");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(rateLimiter_1.rateLimiter);
// Routes
app.use('/api/players', players_1.playerRoutes);
app.use('/api/events', events_1.eventRoutes);
app.use('/api/news', news_1.newsRoutes);
// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Error handler
app.use(errorHandler_1.errorHandler);
// Initialize database and start server
function initDatabase() {
    const db = (0, database_1.getDatabase)();
    // Auto-run migrations
    const migrationsDir = path_1.default.resolve(__dirname, '../migrations');
    if (fs_1.default.existsSync(migrationsDir)) {
        const files = fs_1.default.readdirSync(migrationsDir).sort();
        for (const file of files) {
            if (file.endsWith('.sql')) {
                const sql = fs_1.default.readFileSync(path_1.default.join(migrationsDir, file), 'utf-8');
                db.exec(sql);
            }
        }
        logger_1.logger.info('Migrations applied.');
    }
    // Auto-run seeds if players table is empty
    const playerCount = db.prepare('SELECT COUNT(*) as count FROM players').get();
    if (playerCount.count === 0) {
        const seedsDir = path_1.default.resolve(__dirname, '../seeds');
        if (fs_1.default.existsSync(seedsDir)) {
            const files = fs_1.default.readdirSync(seedsDir).sort();
            for (const file of files) {
                if (file.endsWith('.sql')) {
                    const sql = fs_1.default.readFileSync(path_1.default.join(seedsDir, file), 'utf-8');
                    db.exec(sql);
                }
            }
            logger_1.logger.info('Seeds applied.');
        }
    }
}
initDatabase();
(0, cron_1.initCronJobs)();
app.listen(env_1.env.PORT, () => {
    logger_1.logger.info(`Project B Server running on http://localhost:${env_1.env.PORT}`);
    logger_1.logger.info(`Environment: ${env_1.env.NODE_ENV}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map