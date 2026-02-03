import { query } from '../config/database';

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
    latitude: parseFloat(String(row.latitude)),
    longitude: parseFloat(String(row.longitude)),
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

export async function getAllEvents(filters: { status?: string; season?: string }) {
  let sql = 'SELECT * FROM events WHERE 1=1';
  const params: any[] = [];
  let idx = 1;

  if (filters.status) {
    sql += ` AND status = $${idx++}`;
    params.push(filters.status);
  }
  if (filters.season) {
    sql += ` AND season = $${idx++}`;
    params.push(filters.season);
  }

  sql += ' ORDER BY start_date ASC';

  const result = await query(sql, params);
  return result.rows.map(formatEvent);
}

export async function getEventById(id: number) {
  const result = await query('SELECT * FROM events WHERE id = $1', [id]);
  return result.rows[0] ? formatEvent(result.rows[0]) : null;
}

export async function getNextEvent() {
  const result = await query(`
    SELECT * FROM events
    WHERE status = 'upcoming' AND start_date >= CURRENT_DATE
    ORDER BY start_date ASC
    LIMIT 1
  `);
  return result.rows[0] ? formatEvent(result.rows[0]) : null;
}
