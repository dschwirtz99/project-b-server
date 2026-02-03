import { Request, Response } from 'express';
import { getAllEvents, getEventById, getNextEvent } from '../models/Event';

export async function listEvents(req: Request, res: Response): Promise<void> {
  const { status, season } = req.query;
  const events = await getAllEvents({
    status: status as string,
    season: season as string,
  });
  res.json({ events });
}

export async function getEvent(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id as string, 10);
  const event = await getEventById(id);

  if (!event) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }

  res.json({ event });
}

export async function nextEvent(_req: Request, res: Response): Promise<void> {
  const event = await getNextEvent();

  if (!event) {
    res.json({ event: null, message: 'No upcoming events' });
    return;
  }

  res.json({ event });
}
