"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsRoutes = void 0;
const express_1 = require("express");
const newsController_1 = require("../controllers/newsController");
const router = (0, express_1.Router)();
exports.newsRoutes = router;
router.get('/', newsController_1.listNews);
//# sourceMappingURL=news.js.map