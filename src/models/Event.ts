import { getDatabase } from '../config/database';

export interface EventRow {
  id: number;
  name: string;
  city: string;
  country: string;
  venue: string | null;
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
  description: string | null;
  tournament_number: number | null;
  season: string;
  teams_json: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export function formatEvent(row: EventRow) {
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

export function getAllEvents(filters: { status?: string; season?: string }) {
  const db = getDatabase();
  let query = 'SELECT * FROM events WHERE 1=1';
  const params: any[] = [];

  if (filters.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }
  if (filters.season) {
    query += ' AND season = ?';
    params.push(filters.season);
  }

  query += ' ORDER BY start_date ASC';

  const rows = db.prepare(query).all(...params) as EventRow[];
  return rows.map(formatEvent);
}

export function getEventById(id: number) {
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM events WHERE id = ?').get(id) as EventRow | undefined;
  return row ? formatEvent(row) : null;
}

export function getNextEvent() {
  const db = getDatabase();
  const row = db.prepare(`
    SELECT * FROM events
    WHERE status = 'upcoming' AND start_date >= date('now')
    ORDER BY start_date ASC
    LIMIT 1
  `).get() as EventRow | undefined;
  return row ? formatEvent(row) : null;
}
