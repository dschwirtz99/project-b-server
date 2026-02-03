CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  photo_url TEXT,
  position VARCHAR(50),
  nationality VARCHAR(100),
  nationality_code VARCHAR(3),
  team VARCHAR(100),
  height_cm INTEGER,
  bio TEXT,
  stats_json TEXT,
  social_instagram VARCHAR(255),
  social_twitter VARCHAR(255),
  source_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_players_slug ON players(slug);
CREATE INDEX IF NOT EXISTS idx_players_position ON players(position);
CREATE INDEX IF NOT EXISTS idx_players_nationality ON players(nationality);
CREATE INDEX IF NOT EXISTS idx_players_team ON players(team);
