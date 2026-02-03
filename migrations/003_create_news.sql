CREATE TABLE IF NOT EXISTS news_articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  source_name VARCHAR(200),
  source_url TEXT UNIQUE NOT NULL,
  thumbnail_url TEXT,
  published_at TIMESTAMP NOT NULL,
  fetched_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_published_at ON news_articles(published_at);
