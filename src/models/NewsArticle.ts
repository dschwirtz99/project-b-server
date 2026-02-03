import { getDatabase } from '../config/database';

export interface NewsRow {
  id: number;
  title: string;
  description: string | null;
  source_name: string | null;
  source_url: string;
  thumbnail_url: string | null;
  published_at: string;
  fetched_at: string;
}

export function formatArticle(row: NewsRow) {
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

export function getNews(page: number = 1, limit: number = 20) {
  const db = getDatabase();
  const offset = (page - 1) * limit;

  const rows = db.prepare(`
    SELECT * FROM news_articles
    ORDER BY published_at DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset) as NewsRow[];

  const countResult = db.prepare('SELECT COUNT(*) as total FROM news_articles').get() as { total: number };

  return {
    articles: rows.map(formatArticle),
    total: countResult.total,
    page,
    limit,
    totalPages: Math.ceil(countResult.total / limit),
  };
}

export function insertArticle(article: Omit<NewsRow, 'id' | 'fetched_at'>) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO news_articles (title, description, source_name, source_url, thumbnail_url, published_at)
    VALUES (@title, @description, @source_name, @source_url, @thumbnail_url, @published_at)
  `);
  return stmt.run(article);
}

export function pruneOldArticles(daysOld: number = 90) {
  const db = getDatabase();
  return db.prepare(`
    DELETE FROM news_articles
    WHERE published_at < datetime('now', '-' || ? || ' days')
  `).run(daysOld);
}
