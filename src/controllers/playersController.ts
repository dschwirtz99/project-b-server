import { Request, Response } from 'express';
import { getAllPlayers, getPlayerBySlug } from '../models/Player';

export function listPlayers(req: Request, res: Response): void {
  const { team, position, nationality, search } = req.query;
  const players = getAllPlayers({
    team: team as string,
    position: position as string,
    nationality: nationality as string,
    search: search as string,
  });
  res.json({ players });
}

export function getPlayer(req: Request, res: Response): void {
  const { slug } = req.params;
  const player = getPlayerBySlug(slug as string);

  if (!player) {
    res.status(404).json({ error: 'Player not found' });
    return;
  }

  res.json({ player });
}
