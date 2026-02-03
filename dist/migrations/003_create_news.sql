CREATE TABLE IF NOT EXISTS news_articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  source_name TEXT,
  source_url TEXT UNIQUE NOT NULL,
  thumbnail_url TEXT,
  published_at TEXT NOT NULL,
  fetched_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_news_published_at ON news_articles(published_at);
