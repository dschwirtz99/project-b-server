import cron from 'node-cron';
import { scrapePlayersFromProjectB } from '../services/scraper';
import { fetchLatestNews } from '../services/newsFetcher';
import { enrichPlayerStats } from '../services/espnFetcher';
import { logger } from '../utils/logger';

export function initCronJobs(): void {
  // Scrape players every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    logger.info('CRON: Running player scrape...');
    await scrapePlayersFromProjectB();
  });

  // Fetch news every 2 hours
  cron.schedule('0 */2 * * *', async () => {
    logger.info('CRON: Fetching latest news...');
    await fetchLatestNews();
  });

  // Enrich player stats once daily at 3 AM
  cron.schedule('0 3 * * *', async () => {
    logger.info('CRON: Enriching player stats from ESPN...');
    await enrichPlayerStats();
  });

  logger.info('Cron jobs initialized:');
  logger.info('  - Player scrape: every 6 hours');
  logger.info('  - News fetch: every 2 hours');
  logger.info('  - Stats enrichment: daily at 3 AM');
}
