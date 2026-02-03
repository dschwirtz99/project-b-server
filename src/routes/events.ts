import { Router } from 'express';
import { listEvents, getEvent, nextEvent } from '../controllers/eventsController';

const router = Router();

router.get('/next', nextEvent);
router.get('/:id', getEvent);
router.get('/', listEvents);

export { router as eventRoutes };
