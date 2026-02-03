import { Router } from 'express';
import { listPlayers, getPlayer } from '../controllers/playersController';

const router = Router();

router.get('/', listPlayers);
router.get('/:slug', getPlayer);

export { router as playerRoutes };
