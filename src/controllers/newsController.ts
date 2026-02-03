import { Request, Response } from 'express';
import { getNews } from '../models/NewsArticle';

export async function listNews(req: Request, res: Response): Promise<void> {
  const page = parseInt(req.query.page as string || '1', 10);
  const limit = parseInt(req.query.limit as string || '20', 10);
  const result = await getNews(page, limit);
  res.json(result);
}
