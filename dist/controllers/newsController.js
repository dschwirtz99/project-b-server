"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listNews = listNews;
const NewsArticle_1 = require("../models/NewsArticle");
function listNews(req, res) {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
    const result = (0, NewsArticle_1.getNews)(page, limit);
    res.json(result);
}
//# sourceMappingURL=newsController.js.map