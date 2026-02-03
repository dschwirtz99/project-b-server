import { Router } from 'express';
import { listNews } from '../controllers/newsController';

const router = Router();

router.get('/', listNews);

export { router as newsRoutes };
