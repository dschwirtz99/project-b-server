"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatArticle = formatArticle;
exports.getNews = getNews;
exports.insertArticle = insertArticle;
exports.pruneOldArticles = pruneOldArticles;
const database_1 = require("../config/database");
function formatArticle(row) {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        sourceName: row.source_name,
        sourceUrl: row.source_url,
        thumbnailUrl: row.thumbnail_url,
        publishedAt: row.published_at,
        fetchedAt: row.fetched_at,
    };
}
function getNews(page = 1, limit = 20) {
    const db = (0, database_1.getDatabase)();
    const offset = (page - 1) * limit;
    const rows = db.prepare(`
    SELECT * FROM news_articles
    ORDER BY published_at DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset);
    const countResult = db.prepare('SELECT COUNT(*) as total FROM news_articles').get();
    return {
        articles: rows.map(formatArticle),
        total: countResult.total,
        page,
        limit,
        totalPages: Math.ceil(countResult.total / limit),
    };
}
function insertArticle(article) {
    const db = (0, database_1.getDatabase)();
    const stmt = db.prepare(`
    INSERT OR IGNORE INTO news_articles (title, description, source_name, source_url, thumbnail_url, published_at)
    VALUES (@title, @description, @source_name, @source_url, @thumbnail_url, @published_at)
  `);
    return stmt.run(article);
}
function pruneOldArticles(daysOld = 90) {
    const db = (0, database_1.getDatabase)();
    return db.prepare(`
    DELETE FROM news_articles
    WHERE published_at < datetime('now', '-' || ? || ' days')
  `).run(daysOld);
}
//# sourceMappingURL=NewsArticle.js.map