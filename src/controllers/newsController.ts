import { Request, Response } from 'express';
import { getNews } from '../models/NewsArticle';

export function listNews(req: Request, res: Response): void {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 50);

  const result = getNews(page, limit);
  res.json(result);
}
