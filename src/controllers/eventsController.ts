import { Request, Response } from 'express';
import { getAllEvents, getEventById, getNextEvent } from '../models/Event';

export function listEvents(req: Request, res: Response): void {
  const { status, season } = req.query;
  const events = getAllEvents({
    status: status as string,
    season: season as string,
  });
  res.json({ events });
}

export function getEvent(req: Request, res: Response): void {
  const id = parseInt(req.params.id as string, 10);
  const event = getEventById(id);

  if (!event) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }

  res.json({ event });
}

export function nextEvent(_req: Request, res: Response): void {
  const event = getNextEvent();

  if (!event) {
    res.json({ event: null, message: 'No upcoming events' });
    return;
  }

  res.json({ event });
}
