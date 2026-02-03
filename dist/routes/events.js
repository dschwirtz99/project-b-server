"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRoutes = void 0;
const express_1 = require("express");
const eventsController_1 = require("../controllers/eventsController");
const router = (0, express_1.Router)();
exports.eventRoutes = router;
router.get('/next', eventsController_1.nextEvent);
router.get('/:id', eventsController_1.getEvent);
router.get('/', eventsController_1.listEvents);
//# sourceMappingURL=events.js.map