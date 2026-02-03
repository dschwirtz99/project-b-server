"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPlayers = listPlayers;
exports.getPlayer = getPlayer;
const Player_1 = require("../models/Player");
function listPlayers(req, res) {
    const { team, position, nationality, search } = req.query;
    const players = (0, Player_1.getAllPlayers)({
        team: team,
        position: position,
        nationality: nationality,
        search: search,
    });
    res.json({ players });
}
function getPlayer(req, res) {
    const { slug } = req.params;
    const player = (0, Player_1.getPlayerBySlug)(slug);
    if (!player) {
        res.status(404).json({ error: 'Player not found' });
        return;
    }
    res.json({ player });
}
//# sourceMappingURL=playersController.js.map