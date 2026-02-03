"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerRoutes = void 0;
const express_1 = require("express");
const playersController_1 = require("../controllers/playersController");
const router = (0, express_1.Router)();
exports.playerRoutes = router;
router.get('/', playersController_1.listPlayers);
router.get('/:slug', playersController_1.getPlayer);
//# sourceMappingURL=players.js.map