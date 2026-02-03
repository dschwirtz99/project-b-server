"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPlayer = formatPlayer;
exports.getAllPlayers = getAllPlayers;
exports.getPlayerBySlug = getPlayerBySlug;
exports.upsertPlayer = upsertPlayer;
const database_1 = require("../config/database");
function formatPlayer(row) {
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
function getAllPlayers(filters) {
    const db = (0, database_1.getDatabase)();
    let query = 'SELECT * FROM players WHERE 1=1';
    const params = [];
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
    const rows = db.prepare(query).all(...params);
    return rows.map(formatPlayer);
}
function getPlayerBySlug(slug) {
    const db = (0, database_1.getDatabase)();
    const row = db.prepare('SELECT * FROM players WHERE slug = ?').get(slug);
    return row ? formatPlayer(row) : null;
}
function upsertPlayer(player) {
    const db = (0, database_1.getDatabase)();
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
//# sourceMappingURL=Player.js.map