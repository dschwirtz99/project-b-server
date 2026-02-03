"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCronJobs = initCronJobs;
const node_cron_1 = __importDefault(require("node-cron"));
const scraper_1 = require("../services/scraper");
const newsFetcher_1 = require("../services/newsFetcher");
const espnFetcher_1 = require("../services/espnFetcher");
const logger_1 = require("../utils/logger");
function initCronJobs() {
    // Scrape players every 6 hours
    node_cron_1.default.schedule('0 */6 * * *', async () => {
        logger_1.logger.info('CRON: Running player scrape...');
        await (0, scraper_1.scrapePlayersFromProjectB)();
    });
    // Fetch news every 2 hours
    node_cron_1.default.schedule('0 */2 * * *', async () => {
        logger_1.logger.info('CRON: Fetching latest news...');
        await (0, newsFetcher_1.fetchLatestNews)();
    });
    // Enrich player stats once daily at 3 AM
    node_cron_1.default.schedule('0 3 * * *', async () => {
        logger_1.logger.info('CRON: Enriching player stats from ESPN...');
        await (0, espnFetcher_1.enrichPlayerStats)();
    });
    logger_1.logger.info('Cron jobs initialized:');
    logger_1.logger.info('  - Player scrape: every 6 hours');
    logger_1.logger.info('  - News fetch: every 2 hours');
    logger_1.logger.info('  - Stats enrichment: daily at 3 AM');
}
//# sourceMappingURL=cron.js.map