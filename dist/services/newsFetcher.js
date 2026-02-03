"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchLatestNews = fetchLatestNews;
const axios_1 = __importDefault(require("axios"));
const NewsArticle_1 = require("../models/NewsArticle");
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
async function fetchLatestNews() {
    if (!env_1.env.NEWSAPI_KEY) {
        logger_1.logger.warn('NEWSAPI_KEY not set. Skipping news fetch. Using seed/scraped data only.');
        return;
    }
    try {
        logger_1.logger.info('Fetching latest news from NewsAPI...');
        const queries = [
            '"Project B" basketball',
            '"Project B" league WNBA',
        ];
        let totalInserted = 0;
        for (const query of queries) {
            const response = await axios_1.default.get('https://newsapi.org/v2/everything', {
                params: {
                    q: query,
                    language: 'en',
                    sortBy: 'publishedAt',
                    pageSize: 50,
                    apiKey: env_1.env.NEWSAPI_KEY,
                },
                timeout: 10000,
            });
            if (response.data.status === 'ok' && response.data.articles) {
                for (const article of response.data.articles) {
                    if (!article.title || article.title === '[Removed]')
                        continue;
                    const result = (0, NewsArticle_1.insertArticle)({
                        title: article.title,
                        description: article.description,
                        source_name: article.source.name,
                        source_url: article.url,
                        thumbnail_url: article.urlToImage,
                        published_at: article.publishedAt,
                    });
                    if (result.changes > 0)
                        totalInserted++;
                }
            }
        }
        // Prune old articles
        const pruned = (0, NewsArticle_1.pruneOldArticles)(90);
        logger_1.logger.info(`News fetch complete. Inserted ${totalInserted} new articles. Pruned ${pruned.changes} old articles.`);
    }
    catch (error) {
        logger_1.logger.error(`News fetch failed: ${error.message}`);
    }
}
//# sourceMappingURL=newsFetcher.js.map