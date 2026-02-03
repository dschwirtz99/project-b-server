import { getDatabase } from '../config/database';

export interface PlayerRow {
  id: number;
  name: string;
  slug: string;
  photo_url: string | null;
  position: string | null;
  nationality: string | null;
  nationality_code: string | null;
  team: string | null;
  height_cm: number | null;
  bio: string | null;
  stats_json: string | null;
  social_instagram: string | null;
  social_twitter: string | null;
  source_url: string | null;
  created_at: string;
  updated_at: string;
}

export function formatPlayer(row: PlayerRow) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    photoUrl: row.photo_url,
    position: row.position,
    nationality: row.nationality,
    nationalityCode: row.nationality_code,
    team: row.team,
    heightCm: row.height_cm,
    bio: row.bio,
    stats: row.stats_json ? JSON.parse(row.stats_json) : null,
    socialInstagram: row.social_instagram,
    socialTwitter: row.social_twitter,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getAllPlayers(filters: {
  team?: string;
  position?: string;
  nationality?: string;
  search?: string;
}) {
  const db = getDatabase();
  let query = 'SELECT * FROM players WHERE 1=1';
  const params: any[] = [];

  if (filters.team) {
    query += ' AND team = ?';
    params.push(filters.team);
  }
  if (filters.position) {
    query += ' AND position LIKE ?';
    params.push(`%${filters.position}%`);
  }
  if (filters.nationality) {
    query += ' AND nationality = ?';
    params.push(filters.nationality);
  }
  if (filters.search) {
    query += ' AND name LIKE ?';
    params.push(`%${filters.search}%`);
  }

  query += ' ORDER BY name ASC';

  const rows = db.prepare(query).all(...params) as PlayerRow[];
  return rows.map(formatPlayer);
}

export function getPlayerBySlug(slug: string) {
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM players WHERE slug = ?').get(slug) as PlayerRow | undefined;
  return row ? formatPlayer(row) : null;
}

export function upsertPlayer(player: Partial<PlayerRow>) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO players (name, slug, photo_url, position, nationality, nationality_code, team, height_cm, bio, stats_json, social_instagram, social_twitter, source_url)
    VALUES (@name, @slug, @photo_url, @position, @nationality, @nationality_code, @team, @height_cm, @bio, @stats_json, @social_instagram, @social_twitter, @source_url)
    ON CONFLICT(slug) DO UPDATE SET
      photo_url = COALESCE(excluded.photo_url, players.photo_url),
      position = COALESCE(excluded.position, players.position),
      nationality = COALESCE(excluded.nationality, players.nationality),
      team = COALESCE(excluded.team, players.team),
      bio = COALESCE(excluded.bio, players.bio),
      stats_json = COALESCE(excluded.stats_json, players.stats_json),
      updated_at = datetime('now')
  `);
  return stmt.run(player);
}
