"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatEvent = formatEvent;
exports.getAllEvents = getAllEvents;
exports.getEventById = getEventById;
exports.getNextEvent = getNextEvent;
const database_1 = require("../config/database");
function formatEvent(row) {
    return {
        id: row.id,
        name: row.name,
        city: row.city,
        country: row.country,
        venue: row.venue,
        latitude: row.latitude,
        longitude: row.longitude,
        startDate: row.start_date,
        endDate: row.end_date,
        description: row.description,
        tournamentNumber: row.tournament_number,
        season: row.season,
        teams: row.teams_json ? JSON.parse(row.teams_json) : null,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
function getAllEvents(filters) {
    const db = (0, database_1.getDatabase)();
    let query = 'SELECT * FROM events WHERE 1=1';
    const params = [];
    if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
    }
    if (filters.season) {
        query += ' AND season = ?';
        params.push(filters.season);
    }
    query += ' ORDER BY start_date ASC';
    const rows = db.prepare(query).all(...params);
    return rows.map(formatEvent);
}
function getEventById(id) {
    const db = (0, database_1.getDatabase)();
    const row = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    return row ? formatEvent(row) : null;
}
function getNextEvent() {
    const db = (0, database_1.getDatabase)();
    const row = db.prepare(`
    SELECT * FROM events
    WHERE status = 'upcoming' AND start_date >= date('now')
    ORDER BY start_date ASC
    LIMIT 1
  `).get();
    return row ? formatEvent(row) : null;
}
//# sourceMappingURL=Event.js.map