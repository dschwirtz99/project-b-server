import axios from 'axios';
import * as cheerio from 'cheerio';
import { upsertPlayer } from '../models/Player';
import { logger } from '../utils/logger';

const PROJECT_B_URL = 'https://projectb.global';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function scrapePlayersFromProjectB(): Promise<void> {
  try {
    logger.info('Starting player scrape from projectb.global...');

    const { data: html } = await axios.get(PROJECT_B_URL, {
      headers: {
        'User-Agent': 'ProjectBTrackerApp/1.0',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(html);

    // Attempt to find player sections - selectors may need updating
    // as the site evolves
    const playerElements = $('[class*="player"], [class*="roster"], [class*="athlete"]');

    let scrapedCount = 0;

    playerElements.each((_i, el) => {
      const $el = $(el);
      const name = $el.find('[class*="name"], h3, h4').first().text().trim();
      const position = $el.find('[class*="position"]').first().text().trim();
      const photoUrl = $el.find('img').first().attr('src') || null;

      if (name && name.length > 2) {
        upsertPlayer({
          name,
          slug: slugify(name),
          photo_url: photoUrl,
          position: position || null,
          nationality: null,
          nationality_code: null,
          team: null,
          height_cm: null,
          bio: null,
          stats_json: null,
          social_instagram: null,
          social_twitter: null,
          source_url: PROJECT_B_URL,
        });
        scrapedCount++;
      }
    });

    logger.info(`Player scrape complete. Upserted ${scrapedCount} players.`);
  } catch (error) {
    logger.error(`Player scrape failed: ${(error as Error).message}`);
  }
}

export async function scrapeNewsFromWeb(): Promise<{ title: string; url: string; source: string; }[]> {
  try {
    logger.info('Scraping news from web sources...');

    // Scrape Google News search results as a fallback
    const query = encodeURIComponent('"Project B" basketball league');
    const { data: html } = await axios.get(
      `https://news.google.com/search?q=${query}&hl=en-US&gl=US&ceid=US:en`,
      {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 15000,
      }
    );

    const $ = cheerio.load(html);
    const articles: { title: string; url: string; source: string }[] = [];

    $('article').each((_i, el) => {
      const title = $(el).find('a').first().text().trim();
      const url = $(el).find('a').first().attr('href') || '';
      const source = $(el).find('[class*="source"], time').first().text().trim();

      if (title && url) {
        articles.push({ title, url, source });
      }
    });

    logger.info(`Scraped ${articles.length} news articles from web.`);
    return articles;
  } catch (error) {
    logger.error(`Web news scrape failed: ${(error as Error).message}`);
    return [];
  }
}
