import axios from 'axios';
import { insertArticle, pruneOldArticles } from '../models/NewsArticle';
import { env } from '../config/env';
import { logger } from '../utils/logger';

interface NewsAPIArticle {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
}

export async function fetchLatestNews(): Promise<void> {
  if (!env.NEWSAPI_KEY) {
    logger.warn('NEWSAPI_KEY not set. Skipping news fetch. Using seed/scraped data only.');
    return;
  }

  try {
    logger.info('Fetching latest news from NewsAPI...');

    const queries = [
      '"Project B" basketball',
      '"Project B" league WNBA',
    ];

    let totalInserted = 0;

    for (const query of queries) {
      const response = await axios.get<NewsAPIResponse>('https://newsapi.org/v2/everything', {
        params: {
          q: query,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 50,
          apiKey: env.NEWSAPI_KEY,
        },
        timeout: 10000,
      });

      if (response.data.status === 'ok' && response.data.articles) {
        for (const article of response.data.articles) {
          if (!article.title || article.title === '[Removed]') continue;

          const result = await insertArticle({
            title: article.title,
            description: article.description,
            source_name: article.source.name,
            source_url: article.url,
            thumbnail_url: article.urlToImage,
            published_at: article.publishedAt,
          });

          if (result.rowCount && result.rowCount > 0) totalInserted++;
        }
      }
    }

    // Prune old articles
    const pruned = await pruneOldArticles(90);
    logger.info(`News fetch complete. Inserted ${totalInserted} new articles. Pruned ${pruned.rowCount || 0} old articles.`);
  } catch (error) {
    logger.error(`News fetch failed: ${(error as Error).message}`);
  }
}
