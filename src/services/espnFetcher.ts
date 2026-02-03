import axios from 'axios';
import * as cheerio from 'cheerio';
import { getDatabase } from '../config/database';
import { logger } from '../utils/logger';

interface PlayerStatsUpdate {
  slug: string;
  stats_json: string;
}

// ESPN player page URLs for known players
const ESPN_PLAYER_URLS: Record<string, string> = {
  'nneka-ogwumike': 'https://www.espn.com/wnba/player/_/id/2491205/nneka-ogwumike',
  'alyssa-thomas': 'https://www.espn.com/wnba/player/_/id/2529184/alyssa-thomas',
  'jonquel-jones': 'https://www.espn.com/wnba/player/_/id/3149391/jonquel-jones',
  'jewell-loyd': 'https://www.espn.com/wnba/player/_/id/2999048/jewell-loyd',
  'kelsey-mitchell': 'https://www.espn.com/wnba/player/_/id/3908809/kelsey-mitchell',
  'kamilla-cardoso': 'https://www.espn.com/wnba/player/_/id/4902248/kamilla-cardoso',
  'sophie-cunningham': 'https://www.espn.com/wnba/player/_/id/4066310/sophie-cunningham',
};

async function scrapeESPNPlayerStats(url: string): Promise<Record<string, any> | null> {
  try {
    const { data: html } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000,
    });

    const $ = cheerio.load(html);
    const stats: Record<string, any> = {};

    // Try to extract key stats from the player page
    $('[class*="StatBlock"], [class*="stat"]').each((_i, el) => {
      const label = $(el).find('[class*="label"], dt').text().trim().toLowerCase();
      const value = $(el).find('[class*="value"], dd').text().trim();
      if (label && value) {
        stats[label] = value;
      }
    });

    return Object.keys(stats).length > 0 ? stats : null;
  } catch {
    return null;
  }
}

export async function enrichPlayerStats(): Promise<void> {
  logger.info('Starting player stats enrichment from ESPN...');

  const db = getDatabase();
  let enrichedCount = 0;

  for (const [slug, url] of Object.entries(ESPN_PLAYER_URLS)) {
    try {
      const freshStats = await scrapeESPNPlayerStats(url);

      if (freshStats) {
        // Merge with existing stats rather than replacing
        const existing = db.prepare('SELECT stats_json FROM players WHERE slug = ?').get(slug) as { stats_json: string | null } | undefined;
        const existingStats = existing?.stats_json ? JSON.parse(existing.stats_json) : {};
        const merged = { ...existingStats, ...freshStats, espn_updated: new Date().toISOString() };

        db.prepare('UPDATE players SET stats_json = ?, updated_at = datetime(\'now\') WHERE slug = ?')
          .run(JSON.stringify(merged), slug);

        enrichedCount++;
      }

      // Be polite to ESPN servers
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      logger.error(`Failed to enrich stats for ${slug}: ${(error as Error).message}`);
    }
  }

  logger.info(`Stats enrichment complete. Updated ${enrichedCount} players.`);
}
