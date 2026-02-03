CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  venue TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  description TEXT,
  tournament_number INTEGER,
  season TEXT DEFAULT '2026-27',
  teams_json TEXT,
  status TEXT DEFAULT 'upcoming' CHECK(status IN ('upcoming', 'live', 'completed', 'pending')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
