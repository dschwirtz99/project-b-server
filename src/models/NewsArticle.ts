import { query } from '../config/database';

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

export async function getNews(page: number = 1, limit: number = 20) {
  const offset = (page - 1) * limit;

  const result = await query(
    'SELECT * FROM news_articles ORDER BY published_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );

  const countResult = await query('SELECT COUNT(*) as total FROM news_articles');

  return {
    articles: result.rows.map(formatArticle),
    total: parseInt(countResult.rows[0].total, 10),
    page,
    limit,
    totalPages: Math.ceil(parseInt(countResult.rows[0].total, 10) / limit),
  };
}

export async function insertArticle(article: Omit<NewsRow, 'id' | 'fetched_at'>) {
  const sql = `
    INSERT INTO news_articles (title, description, source_name, source_url, thumbnail_url, published_at)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (source_url) DO NOTHING
  `;
  return query(sql, [
    article.title, article.description, article.source_name,
    article.source_url, article.thumbnail_url, article.published_at,
  ]);
}

export async function pruneOldArticles(daysOld: number = 90) {
  return query(
    "DELETE FROM news_articles WHERE published_at < NOW() - INTERVAL '1 day' * $1",
    [daysOld]
  );
}
