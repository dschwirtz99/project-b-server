import { Request, Response } from 'express';
import { getAllPlayers, getPlayerBySlug } from '../models/Player';

export async function listPlayers(req: Request, res: Response): Promise<void> {
  const { team, position, nationality, search } = req.query;
  const players = await getAllPlayers({
    team: team as string,
    position: position as string,
    nationality: nationality as string,
    search: search as string,
  });
  res.json({ players });
}

export async function getPlayer(req: Request, res: Response): Promise<void> {
  const { slug } = req.params;
  const player = await getPlayerBySlug(slug as string);

  if (!player) {
    res.status(404).json({ error: 'Player not found' });
    return;
  }

  res.json({ player });
}
