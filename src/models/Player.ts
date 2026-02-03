import { query } from '../config/database';

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

export async function getAllPlayers(filters: {
  team?: string;
  position?: string;
  nationality?: string;
  search?: string;
}) {
  let sql = 'SELECT * FROM players WHERE 1=1';
  const params: any[] = [];
  let idx = 1;

  if (filters.team) {
    sql += ` AND team = $${idx++}`;
    params.push(filters.team);
  }
  if (filters.position) {
    sql += ` AND position ILIKE $${idx++}`;
    params.push(`%${filters.position}%`);
  }
  if (filters.nationality) {
    sql += ` AND nationality = $${idx++}`;
    params.push(filters.nationality);
  }
  if (filters.search) {
    sql += ` AND name ILIKE $${idx++}`;
    params.push(`%${filters.search}%`);
  }

  sql += ' ORDER BY name ASC';

  const result = await query(sql, params);
  return result.rows.map(formatPlayer);
}

export async function getPlayerBySlug(slug: string) {
  const result = await query('SELECT * FROM players WHERE slug = $1', [slug]);
  return result.rows[0] ? formatPlayer(result.rows[0]) : null;
}

export async function upsertPlayer(player: Partial<PlayerRow>) {
  const sql = `
    INSERT INTO players (name, slug, photo_url, position, nationality, nationality_code, team, height_cm, bio, stats_json, social_instagram, social_twitter, source_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    ON CONFLICT(slug) DO UPDATE SET
      photo_url = COALESCE(EXCLUDED.photo_url, players.photo_url),
      position = COALESCE(EXCLUDED.position, players.position),
      nationality = COALESCE(EXCLUDED.nationality, players.nationality),
      team = COALESCE(EXCLUDED.team, players.team),
      bio = COALESCE(EXCLUDED.bio, players.bio),
      stats_json = COALESCE(EXCLUDED.stats_json, players.stats_json),
      updated_at = NOW()
  `;
  return query(sql, [
    player.name, player.slug, player.photo_url, player.position,
    player.nationality, player.nationality_code, player.team,
    player.height_cm, player.bio, player.stats_json,
    player.social_instagram, player.social_twitter, player.source_url,
  ]);
}
