"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEvents = listEvents;
exports.getEvent = getEvent;
exports.nextEvent = nextEvent;
const Event_1 = require("../models/Event");
function listEvents(req, res) {
    const { status, season } = req.query;
    const events = (0, Event_1.getAllEvents)({
        status: status,
        season: season,
    });
    res.json({ events });
}
function getEvent(req, res) {
    const id = parseInt(req.params.id, 10);
    const event = (0, Event_1.getEventById)(id);
    if (!event) {
        res.status(404).json({ error: 'Event not found' });
        return;
    }
    res.json({ event });
}
function nextEvent(_req, res) {
    const event = (0, Event_1.getNextEvent)();
    if (!event) {
        res.json({ event: null, message: 'No upcoming events' });
        return;
    }
    res.json({ event });
}
//# sourceMappingURL=eventsController.js.map